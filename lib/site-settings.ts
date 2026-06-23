import "server-only";
import { read, write } from "./store";
import type { HeroSettings, SocialSettings, SiteSettings } from "./types";

const KEY = "site-settings.json";

export const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    eyebrow: "MEGA TECH DEALS",
    headline: "UP TO 30% OFF\nGAMING GEAR",
    subtext: "JazzCash · EasyPaisa · Card · Cash on Delivery — delivered nationwide",
    ctaLabel: "SHOP DEALS →",
    ctaHref: "/catalog?deals=1",
  },
  socials: {
    facebook: "https://facebook.com/computec",
    whatsapp: "https://wa.me/923001234567",
    instagram: "https://instagram.com/computec",
  },
};

const HERO_LIMITS: Record<keyof HeroSettings, number> = {
  eyebrow: 60,
  headline: 120,
  subtext: 200,
  ctaLabel: 40,
  ctaHref: 200,
};

/** Reads the persisted settings, falling back to defaults for missing fields. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const parsed = await read<Partial<SiteSettings>>(KEY);
  if (!parsed) return DEFAULT_SETTINGS;
  return {
    hero: { ...DEFAULT_SETTINGS.hero, ...(parsed.hero || {}) },
    socials: { ...DEFAULT_SETTINGS.socials, ...(parsed.socials || {}) },
  };
}

/** Keep a CTA href safe: only internal paths or http(s) URLs. */
function safeHref(v: string): string {
  const s = v.trim();
  if (/^\/[^/]/.test(s) || s === "/" || /^https?:\/\//i.test(s)) return s;
  return DEFAULT_SETTINGS.hero.ctaHref;
}

/** Normalize a social link. Empty hides the icon; bare handles/numbers get a sensible URL. */
function socialUrl(field: keyof SocialSettings, value: string): string {
  const s = (value || "").trim().slice(0, 200);
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (field === "whatsapp" && /^\+?[\d][\d\s-]{5,}$/.test(s)) {
    return "https://wa.me/" + s.replace(/[^\d]/g, "");
  }
  return "https://" + s.replace(/^\/+/, "");
}

interface SettingsPatch {
  hero?: Partial<HeroSettings>;
  socials?: Partial<SocialSettings>;
}

/** Validates + persists hero and/or social changes, returning full settings. */
export async function saveSettings(patch: SettingsPatch): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const hero: HeroSettings = { ...current.hero };
  const socials: SocialSettings = { ...current.socials };

  if (patch.hero) {
    (Object.keys(HERO_LIMITS) as (keyof HeroSettings)[]).forEach((key) => {
      const v = patch.hero![key];
      if (typeof v === "string") {
        const trimmed = v.replace(/\r\n/g, "\n").slice(0, HERO_LIMITS[key]);
        hero[key] = key === "ctaHref" ? safeHref(trimmed) : trimmed;
      }
    });
  }

  if (patch.socials) {
    (["facebook", "whatsapp", "instagram"] as (keyof SocialSettings)[]).forEach((key) => {
      const v = patch.socials![key];
      if (typeof v === "string") socials[key] = socialUrl(key, v);
    });
  }

  const next: SiteSettings = { hero, socials };
  await write(KEY, next);
  return next;
}
