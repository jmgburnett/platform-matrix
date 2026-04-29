"use client";

import { useState, useEffect } from "react";
import CustomerRoster from "@/components/customer-roster";

const PASSCODE = "Manatee";
const AUTH_KEY = "pm-auth";

export default function CustomersPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === "1") setUnlocked(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSCODE) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
      setInput("");
    }
  };

  if (unlocked) return <CustomerRoster />;

  return (
    <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>Enter passcode</div>
        <input
          type="password" value={input} onChange={e => setInput(e.target.value)} autoFocus
          style={{
            padding: "10px 16px", background: "#0f172a", border: `1px solid ${error ? "#ef4444" : "#1e293b"}`,
            borderRadius: 8, color: "#e2e8f0", fontSize: 14, outline: "none", width: 200, textAlign: "center",
            fontFamily: "inherit", transition: "border-color 0.15s",
          }}
        />
      </form>
    </div>
  );
}
