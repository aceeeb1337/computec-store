# Computec Store

A Pakistani tech marketplace storefront, implemented in **Next.js (App Router) + TypeScript**
from the `Computec Store.dc.html` Claude Design handoff (Direction C — "Marketplace Pro").

## Screens (real routes)

| Route             | Screen                                                            |
| ----------------- | ---------------------------------------------------------------- |
| `/`               | Home — hero, category rail, flash sale, "Just for you"           |
| `/catalog`        | Catalog with category / price / brand / on-sale filters + sort   |
| `/product/[id]`   | Product detail — gallery, specs, related products                |
| `/cart`           | Cart — quantity steppers, free-delivery threshold, order summary |
| `/checkout`       | Checkout — contact form + JazzCash / EasyPaisa / Card / COD      |
| `/confirm`        | Order confirmation receipt                                       |
| `/manager-pos`    | Owner dashboard — revenue, orders, low-stock, Sheets connect     |

The header (logo, search, cart badge), category bar, and footer persist on every route.

## Running

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Catalog data

By default the store serves the bundled **sample catalog** (`lib/catalog-data.ts`, 20 products).
To go live, publish your products Google Sheet to the web as CSV
(`File → Share → Publish to web → CSV`) and set the link in `.env`:

```
SHEET_CSV_URL=https://docs.google.com/.../pub?output=csv
```

Column order must match `Computec Products Template.csv` from the handoff. The loader
(`lib/products.ts`) fetches and parses the sheet at request time (revalidated every 5
minutes) and falls back to the sample catalog if the sheet is unreachable.

## Payments

`lib/cart-context.tsx` contains `processPayment()`, which **simulates** a gateway
round-trip for the demo. The front-end cannot safely hold gateway secret keys — replace
its body with a call to your own backend that talks to JazzCash / EasyPaisa / a card
gateway and returns `{ ok, ref }`. Cash on Delivery skips the gateway and is marked
`Pending (COD)`.

## State & persistence

Cart and orders live in a client `CartProvider` and persist to `localStorage`
(`computec_cart`, `computec_orders`). Orders are seeded with two sample orders on first
visit so the owner dashboard isn't empty.

## Project structure

```
app/            route segments (home, catalog, product, cart, checkout, confirm, admin)
components/     Header, CategoryBar, Footer, ProductCard, and per-screen client views
lib/            catalog data, product loader, formatting, cart math, cart context, types
```

## Notes on the port

The prototype was built on Claude Design's `DCLogic` runtime (`sc-if` / `sc-for` /
`{{ }}` bindings) as a single state-driven file. This implementation recreates the same
visual output and behaviour using idiomatic Next.js: server components fetch the catalog
and render static content (good for SEO), while interactive pieces (filters, cart,
checkout) are client components. Exact pixel values, colors, and fonts (Archivo / Manrope
/ IBM Plex Mono) are preserved.
