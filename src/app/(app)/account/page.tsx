"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  CreditCard,
  Building2,
  History,
  ArrowRight,
  LogOut,
  Pencil,
  Bell,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { getBusinesses } from "@/actions/business";
import { getStrategies } from "@/actions/strategy";
import { PLAN_TIERS, type PlanTier } from "@/lib/constants";
import Link from "next/link";
import type { Business, Strategy } from "@prisma/client";

const cardClass = "bg-white border-2 border-black shadow-[4px_4px_0px_#000] rounded-xl p-6";

export default function AccountPage() {
  const { data: session } = useSession();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [strategies, setStrategies] = useState<(Strategy & { business: Business })[]>([]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const [biz, strats] = await Promise.all([getBusinesses(), getStrategies()]);
      setBusinesses(biz);
      setStrategies(strats as typeof strategies);
    }
    load();
  }, []);

  useEffect(() => {
    if (session?.user?.name) {
      setEditName(session.user.name);
    }
  }, [session?.user?.name]);

  const plan = (session?.user?.plan || "free") as PlanTier;
  const tier = PLAN_TIERS[plan] || PLAN_TIERS.free;

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const strategyCount = strategies.length;
  const strategyLimit = tier.strategies === -1 ? Infinity : tier.strategies;
  const usagePercent = strategyLimit === Infinity ? 0 : Math.min((strategyCount / strategyLimit) * 100, 100);

  async function handleSaveName() {
    await fetch("/api/account/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setIsEditingProfile(false);
    window.location.reload();
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (res.ok) {
        signOut({ callbackUrl: "/" });
      } else {
        alert("Failed to delete account. Please try again.");
        setDeleting(false);
      }
    } catch {
      alert("Something went wrong.");
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      <h1 className="font-display text-3xl font-bold">ACCOUNT</h1>

      {/* Profile */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <User className="w-5 h-5" />
            Profile
          </h2>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="p-1.5 rounded-lg border-2 border-transparent hover:border-black transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border-2 border-black bg-[#A8A6FF] flex items-center justify-center overflow-hidden">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-bold">{initials}</span>
            )}
          </div>
          <div className="flex-1">
            {isEditingProfile ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border-2 border-black rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#918EFA]"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-[#918EFA] text-white border-2 border-black rounded-lg px-4 py-1.5 text-sm font-bold shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000] transition-all"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="font-bold text-lg">{session?.user?.name || "User"}</p>
            )}
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className={cardClass}>
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <CreditCard className="w-5 h-5" />
          Current Plan
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border-2 border-black ${
                  plan === "pro"
                    ? "bg-[#FFE500] text-black"
                    : plan === "starter"
                    ? "bg-[#A8A6FF] text-black"
                    : "bg-gray-100 text-black"
                }`}
              >
                {plan === "free" ? "Free" : "Active"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {tier.calendarDays} calendar days &bull; {tier.briefLimit} briefs &bull;{" "}
              {tier.strategies === -1 ? "Unlimited strategies" : `${tier.strategies} strategy`}
            </p>

            {/* Usage progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Strategies used</span>
                <span>
                  {strategyCount} / {strategyLimit === Infinity ? "∞" : strategyLimit}
                </span>
              </div>
              <div className="h-2.5 w-full bg-gray-200 rounded-full border border-black overflow-hidden">
                <div
                  className="h-full bg-[#918EFA] rounded-full transition-all"
                  style={{ width: `${strategyLimit === Infinity ? 10 : usagePercent}%` }}
                />
              </div>
            </div>
          </div>
          {plan === "free" && (
            <Link
              href="/pricing"
              className="bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000] rounded-lg px-6 py-3 font-bold flex items-center gap-1 hover:shadow-[2px_2px_0px_#000] transition-all ml-4"
            >
              Upgrade
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Businesses */}
      <div className={cardClass}>
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <Building2 className="w-5 h-5" />
          Businesses
        </h2>
        {businesses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-3">No businesses yet.</p>
            <Link
              href="/onboarding"
              className="inline-block bg-[#A8A6FF] text-black border-2 border-black shadow-[4px_4px_0px_#000] rounded-lg px-6 py-3 font-bold hover:shadow-[2px_2px_0px_#000] transition-all"
            >
              Create Strategy
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                className="p-3 rounded-xl border-2 border-black bg-background"
              >
                <p className="font-bold">{biz.businessName}</p>
                <p className="text-xs text-muted-foreground">{biz.industry}</p>
                <div className="flex gap-1.5 mt-2">
                  {biz.platforms.map((p) => (
                    <span
                      key={p}
                      className="text-xs px-2 py-0.5 rounded border border-black bg-gray-50"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strategy History */}
      <div className={cardClass}>
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <History className="w-5 h-5" />
          Strategy History
        </h2>
        {strategies.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-3">No strategies yet.</p>
            <Link
              href="/onboarding"
              className="inline-block bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000] rounded-lg px-6 py-3 font-bold hover:shadow-[2px_2px_0px_#000] transition-all"
            >
              Build My First Strategy
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {strategies.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/project/${s.id}`}
                className="block p-3 rounded-xl border-2 border-black bg-background hover:shadow-[3px_3px_0px_#000000] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{s.business.businessName}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border-2 border-black ${
                      s.status === "ready" ? "bg-[#918EFA] text-black" : "bg-gray-100"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className={cardClass}>
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#918EFA]" />
            <span className="text-sm">Email me tips on improving my content strategy</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#918EFA]" />
            <span className="text-sm">Notify me about new features and updates</span>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border-2 border-red-400 shadow-[4px_4px_0px_rgba(239,68,68,0.4)] rounded-xl p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-red-600 mb-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 text-white border-2 border-red-800 rounded-lg px-4 py-2 text-sm font-bold hover:bg-red-700 transition-all"
        >
          Delete Account
        </button>
      </div>

      {/* Sign Out */}
      <div className="pt-2">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-[#666] hover:text-black border-2 border-[#ccc] hover:border-black rounded-lg px-4 py-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-red-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete your account, all businesses, strategies, and content
              briefs. This action <strong>cannot be undone</strong>.
            </p>
            <p className="text-sm font-bold mb-2">
              Type <span className="text-red-600">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full border-2 border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
            />
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="border-2 border-[#ccc] hover:border-black rounded-lg px-4 py-2 text-sm font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || deleting}
                className="bg-red-600 text-white border-2 border-red-800 rounded-lg px-4 py-2 text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
