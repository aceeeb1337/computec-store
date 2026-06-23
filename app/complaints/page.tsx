import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Complaints & Suggestions — Computec" };

export default function ComplaintsPage() {
  return (
    <InfoPage title="Complaints & Suggestions">
      <p>Your feedback helps us improve. Whether something went wrong or you have an idea to share, we want to hear it.</p>
      <p>Reach us directly and we&apos;ll get back to you as quickly as we can:</p>
      <ul style={{ paddingLeft: 18, lineHeight: 2 }}>
        <li>📞 +92 300 1234567</li>
        <li>✉️ help@computec.pk</li>
        <li>📍 Hall 3, Hafeez Center, Lahore</li>
      </ul>
      <p>Please include your order number (if any) so we can look into it faster.</p>
    </InfoPage>
  );
}
