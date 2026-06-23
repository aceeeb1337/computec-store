import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSiteSettings, saveSettings } from "@/lib/site-settings";
import type { HeroSettings, SocialSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSiteSettings());
}

export async function POST(req: Request) {
  let body: { hero?: Partial<HeroSettings>; socials?: Partial<SocialSettings> } | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || (!body.hero && !body.socials)) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const saved = await saveSettings({ hero: body.hero, socials: body.socials });

  // The top bar lives in the root layout, so refresh the whole tree.
  revalidatePath("/", "layout");

  return NextResponse.json(saved);
}
