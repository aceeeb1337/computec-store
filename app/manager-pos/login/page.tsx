"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password");
        return;
      }
      router.push("/manager-pos");
      router.refresh();
    } catch {
      setError("Something went wrong — try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "60px 28px 90px" }}>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ background: "linear-gradient(135deg,#1c1d21,#2a2c31)", padding: "30px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 14px", borderRadius: 14, background: "#ff6a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🔒</div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 20, color: "#fff" }}>Owner Sign-in</div>
          <div style={{ fontSize: 13, color: "#c9cace", marginTop: 6 }}>Computec management dashboard</div>
        </div>

        <form onSubmit={submit} style={{ padding: 26 }}>
          <label style={{ display: "block" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#6b6b70" }}>Password</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter dashboard password"
              style={{ width: "100%", marginTop: 7, padding: "12px 14px", border: "1px solid #e6e4dd", borderRadius: 8, fontSize: 14, fontFamily: "var(--font-manrope)", outline: "none" }}
            />
          </label>

          {error && <div style={{ color: "#cc3344", fontSize: 12.5, fontWeight: 700, marginTop: 12 }}>{error}</div>}

          <button
            type="submit"
            disabled={busy || !password}
            style={{ width: "100%", marginTop: 18, background: busy || !password ? "#d8d6cf" : "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, padding: 14, borderRadius: 8, cursor: busy || !password ? "not-allowed" : "pointer" }}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
