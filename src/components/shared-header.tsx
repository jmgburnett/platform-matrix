"use client";

import { ArrowLeft } from "@phosphor-icons/react";

interface NavItem {
  href: string;
  label: string;
  icon?: string;
  active?: boolean;
}

interface HeaderAction {
  label: string;
  onClick: () => void;
  color?: string;
  variant?: "default" | "success" | "danger" | "subtle";
}

interface SharedHeaderProps {
  title: string;
  subtitle?: string;
  activePage: "matrix" | "roster" | "customers";
  actions?: HeaderAction[];
  saveStatus?: "saved" | "saving" | "idle";
  children?: React.ReactNode; // extra content below title row
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Matrix", icon: "⬡" },
  { href: "/roster", label: "Roster", icon: "👤" },
  { href: "/customers", label: "Customers", icon: "🏢" },
];

export default function SharedHeader({ title, subtitle, activePage, actions, saveStatus, children }: SharedHeaderProps) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0a0f1a 0%, #111827 40%, #0c1222 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      {/* Top bar: nav + actions */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        {/* Nav tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10,
            padding: 3, gap: 2,
          }}>
            {NAV_ITEMS.map(item => {
              const isActive = (
                (item.href === "/" && activePage === "matrix") ||
                (item.href === "/roster" && activePage === "roster") ||
                (item.href === "/customers" && activePage === "customers")
              );
              return (
                <a key={item.href} href={item.href} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.15s", letterSpacing: "0.02em",
                  ...(isActive
                    ? { background: "rgba(255,255,255,0.1)", color: "#f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }
                    : { background: "transparent", color: "#475569" }),
                }}>
                  <span style={{ fontSize: 12 }}>{item.icon}</span>
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right: save status + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {saveStatus && (
            <span style={{
              fontSize: 10, fontFamily: "monospace", letterSpacing: 0.5,
              padding: "3px 10px", borderRadius: 12,
              transition: "all 0.3s",
              ...(saveStatus === "saved"
                ? { color: "#3ecf8e", background: "rgba(62,207,142,0.1)", border: "1px solid rgba(62,207,142,0.2)" }
                : saveStatus === "saving"
                ? { color: "#facc15", background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }
                : { color: "#334155", background: "transparent", border: "1px solid #1e293b" }),
            }}>
              {saveStatus === "saved" ? "✓ saved" : saveStatus === "saving" ? "saving…" : "auto-save"}
            </span>
          )}
          {actions?.map((action, i) => {
            const colors = {
              default: { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", text: "#94a3b8" },
              success: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", text: "#10b981" },
              danger: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)", text: "#ef4444" },
              subtle: { bg: "transparent", border: "#1e293b", text: "#475569" },
            }[action.variant || "default"];
            return (
              <button key={i} onClick={action.onClick} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "5px 12px", borderRadius: 8, fontSize: 10, fontWeight: 600,
                cursor: "pointer", fontFamily: "monospace", letterSpacing: 0.5,
                background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text,
                transition: "all 0.15s",
              }}>
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Title area */}
      <div style={{ padding: "14px 24px 16px", textAlign: "center" }}>
        <div style={{
          fontSize: 9, letterSpacing: 5, color: "#475569", textTransform: "uppercase",
          fontFamily: "monospace", marginBottom: 6,
        }}>
          Gloo — Platform &amp; Product Team
        </div>
        <h1 style={{
          fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 2px",
          letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>{subtitle}</p>
        )}
      </div>

      {/* Optional extra content (view toggles, filters, etc.) */}
      {children && (
        <div style={{ padding: "0 24px 12px" }}>
          {children}
        </div>
      )}
    </div>
  );
}
