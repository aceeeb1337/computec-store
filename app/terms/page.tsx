import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Terms and Conditions — Computec" };

export default function TermsPage() {
  return (
    <InfoPage title="Terms and Conditions">
      <p>By using Computec and placing an order, you agree to the terms below. Please read them carefully.</p>
      <p><b>Orders &amp; pricing.</b> All prices are in PKR and may change without notice. We confirm stock and price before your order is finalised. We reserve the right to cancel any order due to pricing errors or unavailability.</p>
      <p><b>Payments.</b> Card and wallet payments are confirmed by the gateway before an order is marked paid. Cash-on-delivery orders are payable in full on delivery.</p>
      <p><b>Delivery.</b> Estimated delivery is 2–4 working days. Timeframes are indicative and may vary by location.</p>
      <p><b>Returns &amp; warranty.</b> Eligible items may be returned within 7 days in original condition. Warranty terms follow the manufacturer or supplier policy.</p>
      <p>This is placeholder copy — replace it with your finalised legal terms before going live.</p>
    </InfoPage>
  );
}
