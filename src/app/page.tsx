"use client";

import { useState } from "react";
import MatrixOrg from "@/components/matrix-org";

const PASSCODE = "Gloonity";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSCODE) {
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
      setInput("");
    }
  };

  if (unlocked) return <MatrixOrg />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, hsl(191 100% 13%), hsl(178 91% 34%))",
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
            color: "rgba(255,255,255,0.5)",
            marginBottom: 8,
          }}
        >
          Platform Matrix
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
            background: "rgba(255,255,255,0.1)",
            border: error ? "1px solid hsl(0 70% 60%)" : "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            color: "white",
            outline: "none",
            textAlign: "center",
            transition: "border-color 0.2s",
          }}
        />
        {error && (
          <span style={{ fontSize: 13, color: "hsl(0 70% 70%)" }}>
            Incorrect password
          </span>
        )}
      </form>
    </div>
  );
}
