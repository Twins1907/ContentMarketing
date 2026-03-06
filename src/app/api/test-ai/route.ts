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

  const models = [
    "claude-3-haiku-20240307",
    "claude-3-5-sonnet-20240620",
    "claude-3-5-sonnet-20241022",
    "claude-sonnet-4-20250514",
    "claude-3-5-haiku-20241022",
  ];

  const results: Record<string, unknown> = {};
  const anthropic = new Anthropic({ apiKey });

  for (const model of models) {
    try {
      const start = Date.now();
      const message = await anthropic.messages.create({
        model,
        max_tokens: 50,
        messages: [{ role: "user", content: "Say hello in JSON: {\"greeting\":\"...\"}" }],
      });
      const elapsed = Date.now() - start;
      const text = message.content[0].type === "text" ? message.content[0].text : "";
      results[model] = { success: true, elapsed_ms: elapsed, response: text };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results[model] = { success: false, error: msg };
    }
  }

  return NextResponse.json(results);
}
