import InfoPage from "@/components/InfoPage";

export const metadata = { title: "FAQ — Computec" };

const QA = [
  { q: "How long does delivery take?", a: "Most orders are dispatched within 24 hours and delivered in 2–4 working days nationwide." },
  { q: "What payment methods do you accept?", a: "JazzCash, EasyPaisa, credit/debit card, and cash on delivery." },
  { q: "Is delivery free?", a: "Yes — delivery is free on all orders over PKR 50,000. A flat PKR 350 applies below that." },
  { q: "Do products come with warranty?", a: "All products carry official manufacturer or supplier warranty unless stated otherwise." },
  { q: "Can I return an item?", a: "Yes — eligible items can be returned within 7 days. Contact us to start a return." },
];

export default function FaqPage() {
  return (
    <InfoPage title="Frequently Asked Questions">
      {QA.map((item) => (
        <div key={item.q} style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 800, color: "#1c1d21", marginBottom: 4 }}>{item.q}</div>
          <div>{item.a}</div>
        </div>
      ))}
    </InfoPage>
  );
}
