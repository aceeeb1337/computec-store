export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice: number;
  stock: number;
  rating: number;
  reviews: number;
  badge: string;
  description: string;
  specs: string;
  image: string;
  /** CSS background value: either url("…") or a gradient tile. */
  tile: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price?: number;
}

export interface Order {
  id: string;
  date: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city: string;
  notes?: string;
  method: PaymentMethod;
  items: OrderItem[];
  subtotal?: number;
  shipping?: number;
  total: number;
  status: string;
  paymentRef?: string;
}

export type PaymentMethod = "jazzcash" | "easypaisa" | "card" | "cod";

export type ProductSource = "sample" | "sheet" | "store";

/** Owner-editable storefront hero content. */
export interface HeroSettings {
  /** Small uppercase eyebrow above the headline. */
  eyebrow: string;
  /** Headline; newlines become line breaks. */
  headline: string;
  /** Supporting line under the headline. */
  subtext: string;
  /** Call-to-action button label. */
  ctaLabel: string;
  /** Where the CTA links (internal path or URL). */
  ctaHref: string;
}

/** Owner-editable social links shown in the top bar (empty = hidden). */
export interface SocialSettings {
  facebook: string;
  whatsapp: string;
  instagram: string;
}

export interface SiteSettings {
  hero: HeroSettings;
  socials: SocialSettings;
}
