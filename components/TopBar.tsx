import Link from "next/link";
import type { SocialSettings } from "@/lib/types";

const LINKS = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Complaints & Suggestions", href: "/complaints" },
];

const SOCIAL_ICONS: Record<keyof SocialSettings, { name: string; icon: React.ReactNode }> = {
  facebook: {
    name: "Facebook",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.51 1.55-1.51H17V3.62c-.3-.04-1.3-.13-2.46-.13-2.43 0-4.1 1.49-4.1 4.22v2.35H7.7V13h2.74v8h3.06z" />
      </svg>
    ),
  },
  whatsapp: {
    name: "WhatsApp",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.92-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.09-.39-.12-.55.12-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.74 2.65 4.2 3.72.59.25 1.04.4 1.4.52.59.18 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28z" />
      </svg>
    ),
  },
  instagram: {
    name: "Instagram",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
        <circle cx="12" cy="12" r="3.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
};

const SOCIAL_ORDER: (keyof SocialSettings)[] = ["facebook", "whatsapp", "instagram"];

export default function TopBar({ socials }: { socials: SocialSettings }) {
  const items: React.ReactNode[] = [];
  LINKS.forEach((l, i) => {
    if (i > 0) items.push(<span key={`d${i}`} style={{ color: "rgba(255,255,255,0.18)" }}>|</span>);
    items.push(
      <Link key={l.label} href={l.href} className="topbar-link" style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>
        {l.label}
      </Link>,
    );
  });

  const activeSocials = SOCIAL_ORDER.filter((k) => socials[k]);

  return (
    <div style={{ background: "#2a2c31", borderBottom: "1px solid #34353b" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 28px", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div className="ct-scroll" style={{ display: "flex", alignItems: "center", gap: 13, overflowX: "auto" }}>
          {items}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          {activeSocials.map((k) => (
            <a
              key={k}
              href={socials[k]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={SOCIAL_ICONS[k].name}
              className="topbar-social"
              style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}
            >
              {SOCIAL_ICONS[k].icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
