"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  MagnifyingGlass, ArrowLeft, CaretDown, CaretRight,
  User, Buildings, Tag, Plus, X,
} from "@phosphor-icons/react";
import SharedHeader from "./shared-header";
import "../app/globals.css";

/* ─── CONSTANTS ─── */
const NONPROFIT_CATEGORIES: Record<string, { label: string; color: string; bg: string }> = {
  "bible-translators": { label: "Bible Translators", color: "#60a5fa", bg: "#60a5fa15" },
  "denominations":     { label: "Denominations",     color: "#f472b6", bg: "#f472b615" },
  "higher-ed":         { label: "Higher Ed",          color: "#a78bfa", bg: "#a78bfa15" },
  "para-church":       { label: "Para Church",        color: "#34d399", bg: "#34d39915" },
  "internal":          { label: "Internal",           color: "#94a3b8", bg: "#94a3b815" },
};

const STAGES: Record<string, { label: string; color: string }> = {
  stabilize:  { label: "S", color: "#f59e0b" },
  modernize:  { label: "M", color: "#06b6d4" },
  productize: { label: "P", color: "#10b981" },
  all:        { label: "All", color: "#94a3b8" },
};

const TYPE_COLORS: Record<string, string> = {
  church: "#3b82f6",
  "360": "#f59e0b",
  gloo: "#06b6d4",
};

/* ─── Inline Edit ─── */
function ET({ value, onChange, placeholder, style, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  style?: React.CSSProperties; className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { setEditing(false); onChange(draft.trim()); };
  if (editing) return (
    <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
      className={className}
      style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "4px 8px", color: "inherit", outline: "none", width: "100%", fontSize: "inherit", fontFamily: "inherit", ...style }}
    />
  );
  return (
    <span onClick={() => setEditing(true)} className={className}
      style={{ cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.15)", ...style }}>
      {value || placeholder || "—"}
    </span>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function CustomerRoster() {
  const orgRow = useQuery(api.orgData.get, { key: "default" });
  const saveOrg = useMutation(api.orgData.save);
  const rosterRow = useQuery(api.rosterData.get, { key: "default" });

  const [org, setOrg] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [userEdited, setUserEdited] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerType, setNewCustomerType] = useState<string>("360");
  const [newCustomerCategory, setNewCustomerCategory] = useState<string>("");
  const saveTimer = useRef<any>(null);

  // Load org data from Convex
  useEffect(() => {
    if (orgRow?.data) {
      try { setOrg(JSON.parse(orgRow.data)); } catch {}
    }
  }, [orgRow]);

  // Parse roster meta
  const rosterMeta = useMemo(() => {
    if (!rosterRow?.data) return {};
    try { return JSON.parse(rosterRow.data); } catch { return {}; }
  }, [rosterRow]);

  // Auto-save with debounce
  const editOrg = (updater: (prev: any) => any) => {
    setOrg((prev: any) => {
      const next = updater(prev);
      setUserEdited(true);
      return next;
    });
  };

  useEffect(() => {
    if (!userEdited || !org) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const json = JSON.stringify(org);
      localStorage.setItem("matrix-org-backup", json);
      saveOrg({ key: "default", data: json });
      setUserEdited(false);
    }, 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [org, userEdited, saveOrg]);

  // Derive layer map
  const layerMap = useMemo(() => {
    if (!org?.layers) return {};
    const map: Record<string, any> = {};
    org.layers.forEach((l: any) => { map[l.id] = l; });
    return map;
  }, [org]);

  // Build customer data with people
  const customers = useMemo(() => {
    if (!org?.products) return [];
    return org.products.map((prod: any) => {
      const people: any[] = [];
      Object.entries(prod.cells || {}).forEach(([layerId, persons]: [string, any]) => {
        (persons || []).forEach((p: any) => {
          const layer = layerMap[layerId];
          const meta = rosterMeta[p.name] || {};
          people.push({
            name: p.name,
            stage: p.stage,
            layerId,
            layerLabel: layer?.label || layerId,
            layerAccent: layer?.accent || "#6366f1",
            role: meta.role || "",
            status: meta.status || "",
            engineeringManager: meta.engineeringManager || "",
            productManager: meta.productManager || "",
            designManager: meta.designManager || "",
            programManager: meta.programManager || "",
          });
        });
      });
      return { ...prod, people };
    });
  }, [org, layerMap, rosterMeta]);

  // Filtered customers
  const filtered = useMemo(() => {
    let list = customers;
    if (filterCategory !== "all") {
      list = list.filter((c: any) => (c.category || "") === filterCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c: any) =>
        c.name.toLowerCase().includes(q) ||
        c.people.some((p: any) => p.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [customers, filterCategory, search]);

  // Category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: customers.length };
    Object.keys(NONPROFIT_CATEGORIES).forEach(k => { stats[k] = 0; });
    customers.forEach((c: any) => {
      const cat = c.category || "";
      if (cat && stats[cat] !== undefined) stats[cat]++;
      else {
        // uncategorized
        stats["uncategorized"] = (stats["uncategorized"] || 0) + 1;
      }
    });
    return stats;
  }, [customers]);

  // Set category for a product
  const setCategory = (productId: string, category: string) => {
    editOrg((prev: any) => ({
      ...prev,
      products: prev.products.map((p: any) =>
        p.id === productId ? { ...p, category } : p
      ),
    }));
  };

  const addCustomer = () => {
    const name = newCustomerName.trim();
    if (!name) return;
    const id = Math.random().toString(36).slice(2, 8);
    editOrg((prev: any) => ({
      ...prev,
      products: [
        ...prev.products,
        { id, name, type: newCustomerType, productLead: "TBD", cells: {}, ...(newCustomerCategory ? { category: newCustomerCategory } : {}) },
      ],
    }));
    setNewCustomerName("");
    setNewCustomerType("360");
    setNewCustomerCategory("");
    setShowAddCustomer(false);
    // Auto-expand the new customer
    setTimeout(() => setExpandedCustomer(id), 100);
  };

  const deleteCustomer = (productId: string, productName: string) => {
    if (!window.confirm(`Remove "${productName}"? This will delete all assignments.`)) return;
    editOrg((prev: any) => ({
      ...prev,
      products: prev.products.filter((p: any) => p.id !== productId),
    }));
  };

  if (!org) {
    return (
      <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#475569", fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowAddCustomer(false)}>
          <form onSubmit={e => { e.preventDefault(); addCustomer(); }} onClick={e => e.stopPropagation()} style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 28,
            maxWidth: 440, width: "90%", color: "#e2e8f0",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", margin: "0 0 20px" }}>Add Customer</h3>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#475569", display: "block", marginBottom: 6 }}>Customer Name</label>
              <input value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} autoFocus
                placeholder="e.g. Wycliffe, Jessup..."
                style={{
                  width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
                  padding: "10px 14px", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none",
                  boxSizing: "border-box",
                }} />
            </div>

            {/* Type */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#475569", display: "block", marginBottom: 6 }}>Product Type</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { value: "360", label: "360°", color: "#f59e0b" },
                  { value: "church", label: "Church", color: "#3b82f6" },
                  { value: "gloo", label: "Gloo", color: "#06b6d4" },
                ].map(t => (
                  <button key={t.value} type="button" onClick={() => setNewCustomerType(t.value)} style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                    ...(newCustomerType === t.value
                      ? { background: t.color + "30", border: `1px solid ${t.color}`, color: t.color }
                      : { background: "transparent", border: "1px solid #1e293b", color: "#475569" }),
                  }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#475569", display: "block", marginBottom: 6 }}>Category (optional)</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(NONPROFIT_CATEGORIES).map(([key, cat]) => (
                  <button key={key} type="button" onClick={() => setNewCustomerCategory(newCustomerCategory === key ? "" : key)} style={{
                    padding: "4px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                    ...(newCustomerCategory === key
                      ? { background: cat.color, border: `1px solid ${cat.color}`, color: "white" }
                      : { background: "transparent", border: "1px solid #1e293b", color: "#475569" }),
                  }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={() => setShowAddCustomer(false)} style={{
                background: "none", border: "1px solid #334155", borderRadius: 8, padding: "8px 18px",
                color: "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "inherit",
              }}>Cancel</button>
              <button type="submit" disabled={!newCustomerName.trim()} style={{
                background: newCustomerName.trim() ? "#064e3b" : "#1e293b",
                border: `1px solid ${newCustomerName.trim() ? "#10b981" : "#334155"}`,
                borderRadius: 8, padding: "8px 18px",
                color: newCustomerName.trim() ? "#10b981" : "#475569",
                cursor: newCustomerName.trim() ? "pointer" : "default",
                fontSize: 12, fontFamily: "inherit", fontWeight: 600,
              }}>Add Customer</button>
            </div>
          </form>
        </div>
      )}

      <SharedHeader
        title="Customer Roster"
        subtitle={`${customers.length} customers · ${customers.reduce((s: number, c: any) => s + c.people.length, 0)} assignments`}
        activePage="customers"
        saveStatus={userEdited ? "saving" : "idle"}
        actions={[
          { label: "+ ADD CUSTOMER", onClick: () => setShowAddCustomer(true), variant: "success" as const },
        ]}
      >
        {/* Search */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 320 }}>
            <MagnifyingGlass size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search customers or people..."
              style={{
                width: "100%", padding: "8px 12px 8px 32px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                color: "#e2e8f0", fontSize: 12, outline: "none", fontFamily: "inherit",
              }}
            />
          </div>
        </div>
      </SharedHeader>

      {/* Category filters */}
      <div style={{ padding: "12px 24px", display: "flex", gap: 8, flexWrap: "wrap", borderBottom: "1px solid #0f172a" }}>
        <button
          onClick={() => setFilterCategory("all")}
          style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            cursor: "pointer", border: "1px solid", fontFamily: "inherit",
            ...(filterCategory === "all"
              ? { background: "#e2e8f0", borderColor: "#e2e8f0", color: "#0f172a" }
              : { background: "transparent", borderColor: "#1e293b", color: "#64748b" }),
          }}
        >
          All ({categoryStats.all})
        </button>
        {Object.entries(NONPROFIT_CATEGORIES).map(([key, cat]) => (
          <button key={key}
            onClick={() => setFilterCategory(filterCategory === key ? "all" : key)}
            style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
              cursor: "pointer", border: "1px solid", fontFamily: "inherit",
              ...(filterCategory === key
                ? { background: cat.color, borderColor: cat.color, color: "white" }
                : { background: "transparent", borderColor: cat.color + "40", color: cat.color }),
            }}
          >
            {cat.label} ({categoryStats[key] || 0})
          </button>
        ))}
        {(categoryStats["uncategorized"] || 0) > 0 && (
          <span style={{ fontSize: 10, color: "#475569", alignSelf: "center", marginLeft: 8 }}>
            {categoryStats["uncategorized"]} uncategorized
          </span>
        )}
      </div>

      {/* Customer list */}
      <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#334155" }}>
            {search ? "No customers match your search" : "No customers in this category"}
          </div>
        ) : (
          filtered.map((customer: any) => {
            const isExpanded = expandedCustomer === customer.id;
            const cat = NONPROFIT_CATEGORIES[customer.category || ""] || null;
            const typeColor = TYPE_COLORS[customer.type] || "#6366f1";

            // Group people by layer
            const byLayer: Record<string, any[]> = {};
            customer.people.forEach((p: any) => {
              if (!byLayer[p.layerId]) byLayer[p.layerId] = [];
              byLayer[p.layerId].push(p);
            });

            // Sort layers by org order
            const layerOrder = (org.layers || []).map((l: any) => l.id);
            const sortedLayers = Object.entries(byLayer).sort(([a], [b]) => {
              return (layerOrder.indexOf(a) - layerOrder.indexOf(b));
            });

            return (
              <div key={customer.id} style={{
                background: "#0b1120", border: "1px solid #1e293b", borderRadius: 12,
                overflow: "hidden", transition: "all 0.15s",
              }}>
                {/* Customer header */}
                <div
                  onClick={() => setExpandedCustomer(isExpanded ? null : customer.id)}
                  style={{
                    padding: "14px 20px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: isExpanded ? "#0f172a" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {isExpanded ? <CaretDown size={14} color="#475569" /> : <CaretRight size={14} color="#475569" />}

                    {/* Type badge */}
                    <span style={{
                      fontSize: 9, padding: "2px 8px", borderRadius: 4, fontWeight: 700,
                      background: typeColor + "20", color: typeColor,
                      border: `1px solid ${typeColor}30`,
                    }}>
                      {customer.type === "church" ? "Church" : customer.type === "gloo" ? "Gloo" : "360°"}
                    </span>

                    {/* Name */}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{customer.name}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        Lead: <span style={{ color: "#94a3b8" }}>{customer.productLead || "TBD"}</span>
                        {" · "}
                        {customer.people.length} {customer.people.length === 1 ? "person" : "people"}
                      </div>
                    </div>

                    {/* Category badge */}
                    {cat && (
                      <span style={{
                        fontSize: 9, padding: "2px 8px", borderRadius: 10, fontWeight: 600,
                        background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30`,
                      }}>
                        {cat.label}
                      </span>
                    )}
                  </div>

                  {/* Layer summary pills */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {sortedLayers.slice(0, 6).map(([layerId, people]) => {
                      const layer = layerMap[layerId];
                      return (
                        <span key={layerId} style={{
                          fontSize: 9, padding: "2px 6px", borderRadius: 4,
                          background: (layer?.accent || "#6366f1") + "15",
                          color: (layer?.accent || "#6366f1") + "bb",
                          border: `1px solid ${(layer?.accent || "#6366f1")}20`,
                          whiteSpace: "nowrap",
                        }}>
                          {(layer?.label || layerId).split(" ")[0]} ({people.length})
                        </span>
                      );
                    })}
                    {sortedLayers.length > 6 && (
                      <span style={{ fontSize: 9, color: "#334155" }}>+{sortedLayers.length - 6}</span>
                    )}
                  </div>
                </div>

                {/* Expanded: category selector + people by layer */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #1e293b" }}>
                    {/* Category selector */}
                    <div style={{
                      padding: "12px 20px", background: "#080e1a",
                      display: "flex", alignItems: "center", gap: 12,
                      borderBottom: "1px solid #1e293b",
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#475569" }}>Category:</span>
                      <div style={{ display: "flex", gap: 6, flex: 1 }}>
                        {Object.entries(NONPROFIT_CATEGORIES).map(([key, c]) => (
                          <button key={key}
                            onClick={() => setCategory(customer.id, customer.category === key ? "" : key)}
                            style={{
                              padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600,
                              cursor: "pointer", border: "1px solid", fontFamily: "inherit", transition: "all 0.15s",
                              ...(customer.category === key
                                ? { background: c.color, borderColor: c.color, color: "white" }
                                : { background: "transparent", borderColor: "#1e293b", color: "#475569" }),
                            }}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => deleteCustomer(customer.id, customer.name)}
                        style={{
                          marginLeft: "auto", padding: "3px 10px", borderRadius: 8, fontSize: 10, fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                          background: "transparent", border: "1px solid #1e293b", color: "#475569",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.color = "#475569"; }}
                      >
                        Remove Customer
                      </button>
                    </div>

                    {/* People by layer */}
                    {sortedLayers.length === 0 ? (
                      <div style={{ padding: "24px 20px", textAlign: "center", color: "#334155", fontSize: 12 }}>
                        No people assigned to this customer yet
                      </div>
                    ) : (
                      <div style={{ padding: "8px 0" }}>
                        {sortedLayers.map(([layerId, people]) => {
                          const layer = layerMap[layerId];
                          const accent = layer?.accent || "#6366f1";
                          return (
                            <div key={layerId} style={{ padding: "8px 20px" }}>
                              {/* Layer header */}
                              <div style={{
                                display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
                              }}>
                                <div style={{
                                  width: 3, height: 16, borderRadius: 2,
                                  background: accent,
                                }} />
                                <span style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 1 }}>
                                  {layer?.label || layerId}
                                </span>
                                <span style={{ fontSize: 10, color: "#334155" }}>({people.length})</span>
                                {layer?.lead?.name && (
                                  <span style={{ fontSize: 10, color: "#475569", marginLeft: "auto" }}>
                                    Lead: {layer.lead.name}
                                  </span>
                                )}
                              </div>

                              {/* People grid */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 11 }}>
                                {people.map((person: any, idx: number) => (
                                  <div key={idx} style={{
                                    display: "grid",
                                    gridTemplateColumns: "minmax(140px, 1fr) minmax(120px, 1fr) 60px minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr)",
                                    gap: 0, padding: "6px 12px",
                                    background: idx % 2 === 0 ? "#0b1120" : "#0d1428",
                                    borderRadius: 6, alignItems: "center",
                                  }}>
                                    {/* Name */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <div style={{
                                        width: 24, height: 24, borderRadius: 6, display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        fontSize: 9, fontWeight: 700, flexShrink: 0,
                                        background: accent + "20", color: accent,
                                        border: `1px solid ${accent}30`,
                                      }}>
                                        {person.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                                      </div>
                                      <div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{person.name}</div>
                                        {person.status === "provisional" && (
                                          <span style={{ fontSize: 8, padding: "0px 4px", borderRadius: 3, fontWeight: 700, background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b30" }}>PROVISIONAL</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Role */}
                                    <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {person.role || <span style={{ color: "#334155" }}>—</span>}
                                    </div>

                                    {/* Stage */}
                                    <div>
                                      <span style={{
                                        fontSize: 9, padding: "2px 7px", borderRadius: 4, fontWeight: 700,
                                        background: (STAGES[person.stage]?.color || "#94a3b8") + "20",
                                        color: STAGES[person.stage]?.color || "#94a3b8",
                                        border: `1px solid ${(STAGES[person.stage]?.color || "#94a3b8")}30`,
                                      }}>
                                        {STAGES[person.stage]?.label || person.stage}
                                      </span>
                                    </div>

                                    {/* EM */}
                                    <div style={{ fontSize: 10, color: person.engineeringManager ? "#818cf8" : "#1e293b" }}>
                                      {person.engineeringManager || "—"}
                                    </div>

                                    {/* PM */}
                                    <div style={{ fontSize: 10, color: person.productManager ? "#f472b6" : "#1e293b" }}>
                                      {person.productManager || "—"}
                                    </div>

                                    {/* DM */}
                                    <div style={{ fontSize: 10, color: person.designManager ? "#f97316" : "#1e293b" }}>
                                      {person.designManager || "—"}
                                    </div>

                                    {/* PgM */}
                                    <div style={{ fontSize: 10, color: person.programManager ? "#10b981" : "#1e293b" }}>
                                      {person.programManager || "—"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Summary bar */}
                    <div style={{
                      padding: "10px 20px", borderTop: "1px solid #1e293b",
                      display: "flex", gap: 16, flexWrap: "wrap",
                      background: "#080e1a",
                    }}>
                      {[
                        { label: "Stabilize", stage: "stabilize", color: "#f59e0b" },
                        { label: "Modernize", stage: "modernize", color: "#06b6d4" },
                        { label: "Productize", stage: "productize", color: "#10b981" },
                        { label: "All Stages", stage: "all", color: "#94a3b8" },
                      ].map(s => {
                        const count = customer.people.filter((p: any) => p.stage === s.stage).length;
                        return (
                          <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color + "40" }} />
                            <span style={{ fontSize: 10, color: "#475569" }}>{s.label}:</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
