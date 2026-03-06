import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "placeholder" || apiKey.trim() === "") {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const start = Date.now();
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 50,
      messages: [{ role: "user", content: "Say hello in JSON: {\"greeting\":\"...\"}" }],
    });
    const elapsed = Date.now() - start;
    const text = message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({
      success: true,
      model: message.model,
      elapsed_ms: elapsed,
      response: text,
      usage: message.usage,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("AI test failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
