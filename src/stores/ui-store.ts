import { create } from "zustand";

interface UIState {
  activeTab: "calendar" | "audience" | "pillars" | "platforms";
  selectedDay: number | null;
  briefPanelOpen: boolean;
  selectedBriefId: string | null;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  setSelectedDay: (day: number | null) => void;
  setBriefPanelOpen: (open: boolean) => void;
  setSelectedBriefId: (id: string | null) => void;
  openBrief: (day: number, briefId: string) => void;
  closeBrief: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: "calendar",
  selectedDay: null,
  briefPanelOpen: false,
  selectedBriefId: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedDay: (day) => set({ selectedDay: day }),
  setBriefPanelOpen: (open) => set({ briefPanelOpen: open }),
  setSelectedBriefId: (id) => set({ selectedBriefId: id }),
  openBrief: (day, briefId) =>
    set({ selectedDay: day, selectedBriefId: briefId, briefPanelOpen: true }),
  closeBrief: () =>
    set({ selectedDay: null, selectedBriefId: null, briefPanelOpen: false }),
}));
