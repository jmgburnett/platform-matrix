"use client";

import { useState, useEffect } from "react";
import TeamRoster from "@/components/team-roster";

const PASSCODE = "Manatee";
const AUTH_KEY = "pm-auth";

export default function RosterPage() {
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

  if (unlocked) return <TeamRoster />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e1a, #1a1040)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 8,
          }}
        >
          Team Roster
        </div>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password"
          autoFocus
          style={{
            width: 280,
            padding: "14px 20px",
            fontSize: 15,
            fontFamily: "inherit",
            background: "rgba(255,255,255,0.06)",
            border: error ? "1px solid #f87171" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "white",
            outline: "none",
            textAlign: "center",
            transition: "border-color 0.2s",
          }}
        />
        {error && (
          <span style={{ fontSize: 13, color: "#f87171" }}>
            Incorrect password
          </span>
        )}
      </form>
    </div>
  );
}
