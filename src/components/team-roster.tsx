"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  MagnifyingGlass, ArrowLeft, CaretDown, CaretRight,
  User, Envelope, Phone, Note, Plus,
} from "@phosphor-icons/react";
import { JDS, JD_TITLES } from "@/lib/job-descriptions";
import "../app/globals.css";

/* ─── TYPES ─── */
interface Assignment {
  productId: string;
  productName: string;
  productType: string;
  layerId: string;
  layerLabel: string;
  stage: string;
}

interface PersonFromMatrix {
  name: string;
  assignments: Assignment[];
  layerLeaders: { layerId: string; layerLabel: string; leaderName: string }[];
  executives: { execName: string; execRole: string }[];
}

interface RosterMeta {
  role: string;
  capabilities: string[];
  email: string;
  phone: string;
  notes: string;
}

/* ─── STAGES ─── */
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

/* ─── Inline Editable ─── */
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

/* ─── Tag input for capabilities ─── */
function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) { onChange([...tags, v]); }
    setInput("");
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
      {tags.map((t, i) => (
        <span key={i} style={{
          display: "inline-flex", alignItems: "center", gap: 4, background: "#1e293b",
          border: "1px solid #334155", borderRadius: 6, padding: "2px 8px", fontSize: 11, color: "#94a3b8",
        }}>
          {t}
          <button onClick={() => onChange(tags.filter((_, j) => j !== i))}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}>×</button>
        </span>
      ))}
      <input ref={ref} value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1)); }}
        onBlur={() => { if (input.trim()) add(); }}
        placeholder={tags.length === 0 ? "Add capability..." : "+"}
        style={{
          background: "transparent", border: "none", outline: "none", color: "#cbd5e1",
          fontSize: 11, padding: "2px 4px", minWidth: 80, flex: 1,
        }}
      />
    </div>
  );
}

/* ─── Extract people from org data ─── */
function extractPeople(org: any): Record<string, PersonFromMatrix> {
  const people: Record<string, PersonFromMatrix> = {};

  // Build exec → layer coverage
  const layerToExec: Record<string, any> = {};
  (org.executives || []).forEach((ex: any) => {
    (ex.layers || []).forEach((lId: string) => { layerToExec[lId] = ex; });
  });

  // Build layer lookup
  const layerById: Record<string, any> = {};
  (org.layers || []).forEach((l: any) => { layerById[l.id] = l; });

  // Extract from product cells
  (org.products || []).forEach((prod: any) => {
    Object.entries(prod.cells || {}).forEach(([layerId, items]: [string, any]) => {
      const layer = layerById[layerId];
      if (!layer) return;
      (items || []).forEach((item: any) => {
        const key = item.name;
        if (!people[key]) {
          people[key] = { name: key, assignments: [], layerLeaders: [], executives: [] };
        }
        people[key].assignments.push({
          productId: prod.id,
          productName: prod.name,
          productType: prod.type,
          layerId,
          layerLabel: layer.label,
          stage: item.stage,
        });
      });
    });
  });

  // Attach layer leaders and executives
  Object.values(people).forEach((person) => {
    const seenLeaders = new Set<string>();
    const seenExecs = new Set<string>();
    person.assignments.forEach((a) => {
      const layer = layerById[a.layerId];
      if (layer?.lead?.name && !seenLeaders.has(a.layerId)) {
        seenLeaders.add(a.layerId);
        person.layerLeaders.push({ layerId: a.layerId, layerLabel: a.layerLabel, leaderName: layer.lead.name });
      }
      const exec = layerToExec[a.layerId];
      if (exec && !seenExecs.has(exec.id)) {
        seenExecs.add(exec.id);
        person.executives.push({ execName: exec.name, execRole: exec.role });
      }
    });
  });

  return people;
}

/* ─── Role Select with JD titles + custom ─── */
function RoleSelect({ value, onChange, compact }: { value: string; onChange: (v: string) => void; compact?: boolean }) {
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newRole, setNewRole] = useState("");
  const addRef = useRef<HTMLInputElement>(null);

  // Load custom roles from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("roster-custom-roles");
      if (stored) setCustomRoles(JSON.parse(stored));
    } catch {}
  }, []);

  const saveCustomRole = (role: string) => {
    const updated = [...customRoles, role];
    setCustomRoles(updated);
    localStorage.setItem("roster-custom-roles", JSON.stringify(updated));
  };

  const allRoles = [...JD_TITLES, ...customRoles];

  useEffect(() => { if (adding && addRef.current) addRef.current.focus(); }, [adding]);

  const handleAddSubmit = () => {
    const trimmed = newRole.trim();
    if (trimmed && !allRoles.includes(trimmed)) {
      saveCustomRole(trimmed);
      onChange(trimmed);
    } else if (trimmed) {
      onChange(trimmed);
    }
    setNewRole("");
    setAdding(false);
  };

  if (adding) {
    return (
      <input ref={addRef} value={newRole} onChange={e => setNewRole(e.target.value)}
        onBlur={handleAddSubmit}
        onKeyDown={e => { if (e.key === "Enter") handleAddSubmit(); if (e.key === "Escape") { setNewRole(""); setAdding(false); } }}
        placeholder="Type new role..."
        style={{
          background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
          padding: compact ? "3px 8px" : "5px 8px", color: "#e2e8f0",
          fontSize: compact ? 11 : 12, fontFamily: "inherit", outline: "none", width: "100%",
        }}
      />
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <select
        value={allRoles.includes(value) ? value : "__other__"}
        onChange={e => {
          const v = e.target.value;
          if (v === "__add__") { setAdding(true); return; }
          if (v === "__other__") return;
          onChange(v);
        }}
        style={{
          background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
          padding: compact ? "3px 8px" : "5px 8px", color: value ? "#cbd5e1" : "#64748b",
          fontSize: compact ? 11 : 12, fontFamily: "inherit", outline: "none", width: "100%",
          cursor: "pointer", appearance: "auto",
        }}
      >
        <option value="__other__" disabled={!value}>
          {value && !allRoles.includes(value) ? value : "Select role..."}
        </option>
        {allRoles.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
        <option value="__add__">＋ Add new role...</option>
      </select>
    </div>
  );
}

/* ─── Reports To Editor ─── */
function ReportsToEditor({ personName, layerLeaders, executives, layers, org, onSaveOrg }: {
  personName: string;
  layerLeaders: { layerId: string; layerLabel: string; leaderName: string }[];
  executives: { execName: string; execRole: string }[];
  layers: { id: string; label: string }[];
  org: any;
  onSaveOrg: (updated: any) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [selLayer, setSelLayer] = useState("");

  // Get all layers this person is NOT already assigned to (for adding)
  const assignedLayerIds = new Set(layerLeaders.map(ll => ll.layerId));
  const availableLayers = layers.filter(l => !assignedLayerIds.has(l.id));

  // Assign person to a layer (add to all products that have that layer)
  const assignToLayer = (layerId: string) => {
    if (!org || !layerId) return;
    // Add person to first product's layer cell if not already there
    const updated = {
      ...org,
      products: org.products.map((p: any, idx: number) => {
        if (idx !== 0) return p; // Add to first product
        const cells = { ...p.cells };
        const existing = cells[layerId] || [];
        if (!existing.some((item: any) => item.name === personName)) {
          cells[layerId] = [...existing, { name: personName, stage: "stabilize" }];
        }
        return { ...p, cells };
      }),
    };
    onSaveOrg(updated);
    setSelLayer("");
    setAdding(false);
  };

  // Remove person from a layer across all products
  const removeFromLayer = (layerId: string) => {
    if (!org) return;
    const updated = {
      ...org,
      products: org.products.map((p: any) => {
        const cells = { ...p.cells };
        if (cells[layerId]) {
          cells[layerId] = cells[layerId].filter((item: any) => item.name !== personName);
        }
        return { ...p, cells };
      }),
    };
    onSaveOrg(updated);
  };

  return (
    <div>
      <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "block", marginBottom: 8 }}>
        Reports To
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {layerLeaders.map((ll, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 10px", background: "#0f172a", borderRadius: 8,
            border: "1px solid #1e293b",
          }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{ll.leaderName}</span>
              <span style={{ fontSize: 10, color: "#64748b", marginLeft: 8 }}>{ll.layerLabel} Lead</span>
            </div>
            <button onClick={() => removeFromLayer(ll.layerId)}
              style={{
                background: "none", border: "none", color: "#475569", cursor: "pointer",
                fontSize: 14, lineHeight: 1, padding: "0 2px", transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
              title="Remove from this layer">×</button>
          </div>
        ))}
        {executives.map((ex, i) => (
          <div key={`ex-${i}`} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 10px", background: "#0f172a", borderRadius: 8,
            border: "1px solid #7c3aed20",
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#c4b5fd" }}>{ex.execName}</span>
            <span style={{ fontSize: 10, color: "#7c3aed" }}>{ex.execRole}</span>
          </div>
        ))}
      </div>
      {adding ? (
        <div style={{
          marginTop: 6, padding: 8, background: "#0f172a", borderRadius: 8,
          border: "1px solid #334155", display: "flex", gap: 6,
        }}>
          <select value={selLayer} onChange={e => setSelLayer(e.target.value)}
            style={{
              flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
              padding: "5px 8px", color: "#cbd5e1", fontSize: 11, fontFamily: "inherit", outline: "none",
            }}>
            <option value="">Select layer...</option>
            {availableLayers.map(l => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
          <button onClick={() => assignToLayer(selLayer)}
            disabled={!selLayer}
            style={{
              background: selLayer ? "#1e3a5f" : "#1e293b",
              border: "1px solid " + (selLayer ? "#3b82f6" : "#334155"),
              borderRadius: 6, padding: "4px 10px", color: selLayer ? "#60a5fa" : "#475569",
              cursor: selLayer ? "pointer" : "default", fontSize: 11, fontWeight: 600, fontFamily: "inherit",
            }}>Add</button>
          <button onClick={() => setAdding(false)}
            style={{
              background: "none", border: "1px solid #334155", borderRadius: 6, padding: "4px 10px",
              color: "#64748b", cursor: "pointer", fontSize: 11, fontFamily: "inherit",
            }}>×</button>
        </div>
      ) : (
        availableLayers.length > 0 && (
          <button onClick={() => setAdding(true)}
            style={{
              marginTop: 6, background: "none", border: "1px dashed #334155", borderRadius: 8,
              color: "#475569", cursor: "pointer", fontSize: 11, padding: "6px 12px",
              transition: "all 0.15s", width: "100%", textAlign: "center",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#64748b"; e.currentTarget.style.color = "#94a3b8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#475569"; }}>
            + Assign to Layer Lead
          </button>
        )
      )}
    </div>
  );
}

/* ─── Add Assignment Control ─── */
function AddAssignmentControl({ personName, products, layers, currentAssignments, onAdd }: {
  personName: string;
  products: { id: string; name: string; type: string }[];
  layers: { id: string; label: string }[];
  currentAssignments: Assignment[];
  onAdd: (name: string, prodId: string, layerId: string, stage: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selProduct, setSelProduct] = useState("");
  const [selLayer, setSelLayer] = useState("");
  const [selStage, setSelStage] = useState("stabilize");

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{
        marginTop: 6, background: "none", border: "1px dashed #334155", borderRadius: 8,
        color: "#475569", cursor: "pointer", fontSize: 11, padding: "6px 12px",
        transition: "all 0.15s", width: "100%", textAlign: "center",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#64748b"; e.currentTarget.style.color = "#94a3b8"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#475569"; }}>
      + Add Assignment
    </button>
  );

  const handleAdd = () => {
    if (selProduct && selLayer) {
      onAdd(personName, selProduct, selLayer, selStage);
      setSelProduct("");
      setSelLayer("");
      setSelStage("stabilize");
      setOpen(false);
    }
  };

  return (
    <div style={{
      marginTop: 6, padding: 10, background: "#0f172a", borderRadius: 8,
      border: "1px solid #334155", display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <select value={selProduct} onChange={e => setSelProduct(e.target.value)}
          style={{
            flex: 1, minWidth: 100, background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
            padding: "5px 8px", color: "#cbd5e1", fontSize: 11, fontFamily: "inherit", outline: "none",
          }}>
          <option value="">Customer...</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={selLayer} onChange={e => setSelLayer(e.target.value)}
          style={{
            flex: 1, minWidth: 100, background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
            padding: "5px 8px", color: "#cbd5e1", fontSize: 11, fontFamily: "inherit", outline: "none",
          }}>
          <option value="">Layer...</option>
          {layers.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
        <select value={selStage} onChange={e => setSelStage(e.target.value)}
          style={{
            width: 90, background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
            padding: "5px 8px", color: "#cbd5e1", fontSize: 11, fontFamily: "inherit", outline: "none",
          }}>
          <option value="stabilize">Stabilize</option>
          <option value="modernize">Modernize</option>
          <option value="productize">Productize</option>
          <option value="all">All</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button onClick={() => setOpen(false)}
          style={{
            background: "none", border: "1px solid #334155", borderRadius: 6, padding: "4px 12px",
            color: "#64748b", cursor: "pointer", fontSize: 11, fontFamily: "inherit",
          }}>Cancel</button>
        <button onClick={handleAdd}
          disabled={!selProduct || !selLayer}
          style={{
            background: selProduct && selLayer ? "#1e3a5f" : "#1e293b",
            border: "1px solid " + (selProduct && selLayer ? "#3b82f6" : "#334155"),
            borderRadius: 6, padding: "4px 12px",
            color: selProduct && selLayer ? "#60a5fa" : "#475569",
            cursor: selProduct && selLayer ? "pointer" : "default",
            fontSize: 11, fontFamily: "inherit", fontWeight: 600,
          }}>Add</button>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN ═══════════════ */
export default function TeamRoster() {
  const [rosterMeta, setRosterMeta] = useState<Record<string, RosterMeta>>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  const [filterLayer, setFilterLayer] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");

  const convexOrg = useQuery(api.orgData.get, { key: "default" });
  const convexRoster = useQuery(api.rosterData.get, { key: "default" });
  const saveRoster = useMutation(api.rosterData.save);
  const saveOrg = useMutation(api.orgData.save);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const orgSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [orgLocal, setOrgLocal] = useState<any>(null);

  const org = useMemo(() => {
    if (orgLocal) return orgLocal;
    if (!convexOrg?.data) return null;
    try { return JSON.parse(convexOrg.data); } catch { return null; }
  }, [convexOrg, orgLocal]);

  // Load roster metadata
  useEffect(() => {
    if (loaded) return;
    if (convexRoster === undefined) return;
    if (convexRoster?.data) {
      try { setRosterMeta(JSON.parse(convexRoster.data)); } catch {}
    }
    setLoaded(true);
  }, [convexRoster, loaded]);

  // Auto-save roster metadata
  useEffect(() => {
    if (!loaded) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaving(true);
      saveRoster({ key: "default", data: JSON.stringify(rosterMeta) })
        .then(() => { setSaved(true); setSaving(false); setTimeout(() => setSaved(false), 2000); })
        .catch(() => setSaving(false));
    }, 800);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [rosterMeta, loaded, saveRoster]);

  const people = useMemo(() => org ? extractPeople(org) : {}, [org]);

  const getMeta = (name: string): RosterMeta => rosterMeta[name] || { role: "", capabilities: [], email: "", phone: "", notes: "" };
  const updateMeta = (name: string, updates: Partial<RosterMeta>) => {
    setRosterMeta(prev => ({ ...prev, [name]: { ...getMeta(name), ...updates } }));
  };

  // Save org helper
  const saveOrgData = (updated: any) => {
    setOrgLocal(updated);
    if (orgSaveTimerRef.current) clearTimeout(orgSaveTimerRef.current);
    orgSaveTimerRef.current = setTimeout(() => {
      saveOrg({ key: "default", data: JSON.stringify(updated) });
    }, 800);
  };

  // Remove a person from a specific product+layer cell
  const removeAssignment = (personName: string, productId: string, layerId: string) => {
    if (!org) return;
    const updated = {
      ...org,
      products: org.products.map((p: any) => {
        if (p.id !== productId) return p;
        const newCells: any = { ...p.cells };
        newCells[layerId] = (newCells[layerId] || []).filter((item: any) => item.name !== personName);
        return { ...p, cells: newCells };
      }),
    };
    saveOrgData(updated);
  };

  // Add a person to a product+layer cell
  const addAssignment = (personName: string, productId: string, layerId: string, stage: string = "stabilize") => {
    if (!org) return;
    // Check if already assigned
    const prod = org.products.find((p: any) => p.id === productId);
    if (prod?.cells?.[layerId]?.some((item: any) => item.name === personName)) return;
    const updated = {
      ...org,
      products: org.products.map((p: any) => {
        if (p.id !== productId) return p;
        const newCells: any = { ...p.cells };
        newCells[layerId] = [...(newCells[layerId] || []), { name: personName, stage }];
        return { ...p, cells: newCells };
      }),
    };
    saveOrgData(updated);
  };

  // Rename a person across all product cells in the org data
  const renamePerson = (oldName: string, newName: string) => {
    if (!org || !newName || newName === oldName) return;
    const updated = {
      ...org,
      products: org.products.map((p: any) => {
        const newCells: any = {};
        Object.entries(p.cells || {}).forEach(([layerId, items]: [string, any]) => {
          newCells[layerId] = (items || []).map((item: any) =>
            item.name === oldName ? { ...item, name: newName } : item
          );
        });
        return { ...p, cells: newCells };
      }),
    };
    saveOrgData(updated);
    // Also migrate roster metadata to new name
    setRosterMeta(prev => {
      const next = { ...prev };
      if (next[oldName]) {
        next[newName] = next[oldName];
        delete next[oldName];
      }
      return next;
    });
    if (expandedPerson === oldName) setExpandedPerson(newName);
  };

  // Get unique layers and products for filters
  const layers = useMemo(() => org?.layers?.map((l: any) => ({ id: l.id, label: l.label })) || [], [org]);
  const products = useMemo(() => org?.products?.map((p: any) => ({ id: p.id, name: p.name, type: p.type })) || [], [org]);

  // Filter & search
  const filteredPeople = useMemo(() => {
    return Object.values(people).filter((person: any) => {
      const meta = getMeta(person.name);
      const matchesSearch = !search ||
        person.name.toLowerCase().includes(search.toLowerCase()) ||
        meta.role.toLowerCase().includes(search.toLowerCase()) ||
        meta.capabilities.some((c: string) => c.toLowerCase().includes(search.toLowerCase()));
      const matchesLayer = filterLayer === "all" || person.assignments.some((a: any) => a.layerId === filterLayer);
      const matchesProduct = filterProduct === "all" || person.assignments.some((a: any) => a.productId === filterProduct);
      return matchesSearch && matchesLayer && matchesProduct;
    }).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [people, search, filterLayer, filterProduct, rosterMeta]);

  // Count stats
  const totalPeople = Object.keys(people).length;

  if (!org || !loaded) return (
    <div style={{ minHeight: "100vh", background: "#08080f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%", background: "#06b6d4",
            animation: "bounce 0.6s infinite", animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", color: "#e2e8f0", padding: "24px 32px" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)",
        borderRadius: 16, padding: "28px 32px", marginBottom: 24,
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
              Gloo — Platform & Product Team
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", margin: 0, letterSpacing: -0.5 }}>Team Roster</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
              {totalPeople} team members · Synced with Platform Matrix
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "white",
              background: saved ? "rgba(34,197,94,0.3)" : saving ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.1)",
            }}>
              {saved ? "✓ Saved" : saving ? "Saving..." : "Auto-save"}
            </span>
            <a href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 20, padding: "6px 14px",
              fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)",
              textDecoration: "none", transition: "all 0.15s", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <ArrowLeft size={12} /> Matrix View
            </a>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, background: "#0f172a",
          border: "1px solid #1e293b", borderRadius: 10, padding: "8px 14px", flex: "1 1 260px", maxWidth: 400,
        }}>
          <MagnifyingGlass size={14} color="#64748b" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, role, or capability..."
            style={{
              background: "transparent", border: "none", outline: "none", color: "#e2e8f0",
              fontSize: 13, flex: 1, fontFamily: "inherit",
            }}
          />
        </div>
        <select value={filterLayer} onChange={e => setFilterLayer(e.target.value)}
          style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "8px 12px",
            color: "#94a3b8", fontSize: 12, fontFamily: "inherit", outline: "none", cursor: "pointer",
          }}>
          <option value="all">All Layers</option>
          {layers.map((l: any) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
        <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)}
          style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "8px 12px",
            color: "#94a3b8", fontSize: 12, fontFamily: "inherit", outline: "none", cursor: "pointer",
          }}>
          <option value="all">All Customers</option>
          {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Roster Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px 180px 1fr 180px 200px",
          gap: 1, padding: "10px 16px",
          background: "#0f172a", borderRadius: "10px 10px 0 0",
          borderBottom: "1px solid #1e293b",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#64748b" }}>Name</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#64748b" }}>Role</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#64748b" }}>Capabilities</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#64748b" }}>Reports To</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#64748b" }}>Assignments</span>
        </div>

        {filteredPeople.map((person: any) => {
          const meta = getMeta(person.name);
          const isExpanded = expandedPerson === person.name;
          // Unique layers
          const uniqueLayers = [...new Map(person.assignments.map((a: any) => [a.layerId, a])).values()];
          // Unique products
          const uniqueProducts = [...new Map(person.assignments.map((a: any) => [a.productId, a])).values()];

          return (
            <div key={person.name}>
              {/* Main row */}
              <div
                onClick={() => setExpandedPerson(isExpanded ? null : person.name)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 180px 1fr 180px 200px",
                  gap: 1, padding: "12px 16px",
                  background: isExpanded ? "#111827" : "#0c0f1a",
                  borderBottom: isExpanded ? "none" : "1px solid #0f172a",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "#0c0f1a"; }}
              >
                {/* Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isExpanded ? <CaretDown size={12} weight="bold" color="#64748b" /> : <CaretRight size={12} weight="bold" color="#64748b" />}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 10, fontWeight: 700,
                    background: "linear-gradient(135deg, #1e293b, #334155)", color: "#94a3b8",
                  }}>
                    {person.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }} onClick={e => e.stopPropagation()}>
                    <ET value={person.name} onChange={v => renamePerson(person.name, v)} style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }} />
                  </span>
                </div>

                {/* Role */}
                <div style={{ display: "flex", alignItems: "center", minWidth: 140 }} onClick={e => e.stopPropagation()}>
                  <RoleSelect value={meta.role} onChange={v => updateMeta(person.name, { role: v })} compact />
                </div>

                {/* Capabilities */}
                <div style={{ display: "flex", alignItems: "center", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {meta.capabilities.slice(0, 4).map((c, i) => (
                      <span key={i} style={{
                        fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "#1e293b",
                        border: "1px solid #334155", color: "#94a3b8", whiteSpace: "nowrap",
                      }}>{c}</span>
                    ))}
                    {meta.capabilities.length > 4 && (
                      <span style={{ fontSize: 10, color: "#64748b" }}>+{meta.capabilities.length - 4}</span>
                    )}
                    {meta.capabilities.length === 0 && (
                      <span style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>No capabilities</span>
                    )}
                  </div>
                </div>

                {/* Reports To */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
                  {person.layerLeaders.map((ll: any, i: number) => (
                    <span key={i} style={{ fontSize: 11, color: "#94a3b8" }}>{ll.leaderName}</span>
                  ))}
                </div>

                {/* Assignments */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                  {uniqueProducts.map((a: any) => (
                    <span key={a.productId} style={{
                      fontSize: 10, padding: "2px 7px", borderRadius: 5, fontWeight: 600,
                      background: (TYPE_COLORS[a.productType] || "#6366f1") + "20",
                      color: TYPE_COLORS[a.productType] || "#6366f1",
                      border: `1px solid ${(TYPE_COLORS[a.productType] || "#6366f1")}30`,
                    }}>
                      {a.productName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{
                  background: "#111827", borderBottom: "1px solid #1e293b",
                  padding: "0 16px 20px 52px",
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {/* Left: Contact & Role details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "block", marginBottom: 6 }}>
                          Role / Title
                        </label>
                        <RoleSelect value={meta.role} onChange={v => updateMeta(person.name, { role: v })} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "block", marginBottom: 6 }}>
                          Capabilities / Skills
                        </label>
                        <TagInput tags={meta.capabilities} onChange={c => updateMeta(person.name, { capabilities: c })} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                            <Envelope size={10} /> Email
                          </label>
                          <ET value={meta.email} onChange={v => updateMeta(person.name, { email: v })}
                            placeholder="email@gloo.us" style={{ fontSize: 12, color: "#94a3b8" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                            <Phone size={10} /> Phone
                          </label>
                          <ET value={meta.phone} onChange={v => updateMeta(person.name, { phone: v })}
                            placeholder="(555) 000-0000" style={{ fontSize: 12, color: "#94a3b8" }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                          <Note size={10} /> Notes
                        </label>
                        <ET value={meta.notes} onChange={v => updateMeta(person.name, { notes: v })}
                          placeholder="Add notes..." style={{ fontSize: 12, color: "#94a3b8" }} />
                      </div>
                    </div>

                    {/* Right: Matrix assignments */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "block", marginBottom: 8 }}>
                          Layer Assignments
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {uniqueLayers.map((a: any) => (
                            <div key={a.layerId} style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "6px 10px", background: "#0f172a", borderRadius: 8,
                              border: "1px solid #1e293b",
                            }}>
                              <span style={{ fontSize: 12, color: "#cbd5e1" }}>{a.layerLabel}</span>
                              <span style={{
                                fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 600,
                                background: STAGES[a.stage]?.color + "20",
                                color: STAGES[a.stage]?.color || "#94a3b8",
                              }}>
                                {STAGES[a.stage]?.label || a.stage}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "block", marginBottom: 8 }}>
                          Customer Assignments
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {person.assignments.map((a: any, i: number) => (
                            <div key={i} style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "6px 10px", background: "#0f172a", borderRadius: 8,
                              border: "1px solid #1e293b",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{
                                  fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 700,
                                  background: (TYPE_COLORS[a.productType] || "#6366f1") + "20",
                                  color: TYPE_COLORS[a.productType] || "#6366f1",
                                }}>{a.productName}</span>
                                <span style={{ fontSize: 11, color: "#64748b" }}>→ {a.layerLabel}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{
                                  fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 600,
                                  background: STAGES[a.stage]?.color + "20",
                                  color: STAGES[a.stage]?.color || "#94a3b8",
                                }}>
                                  {STAGES[a.stage]?.label || a.stage}
                                </span>
                                <button onClick={() => removeAssignment(person.name, a.productId, a.layerId)}
                                  style={{
                                    background: "none", border: "none", color: "#475569", cursor: "pointer",
                                    fontSize: 14, lineHeight: 1, padding: "0 2px", transition: "color 0.15s",
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                                  onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
                                  title="Remove assignment">×</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Add assignment */}
                        <AddAssignmentControl
                          personName={person.name}
                          products={products}
                          layers={layers}
                          currentAssignments={person.assignments}
                          onAdd={addAssignment}
                        />
                      </div>

                      <ReportsToEditor
                        personName={person.name}
                        layerLeaders={person.layerLeaders}
                        executives={person.executives}
                        layers={layers}
                        org={org}
                        onSaveOrg={saveOrgData}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredPeople.length === 0 && (
          <div style={{
            padding: 40, textAlign: "center", background: "#0c0f1a",
            borderRadius: "0 0 10px 10px", color: "#475569", fontSize: 13,
          }}>
            No team members found
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div style={{
        display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap", alignItems: "center",
        fontSize: 10, color: "#475569",
      }}>
        <span>Showing {filteredPeople.length} of {totalPeople}</span>
        <span>·</span>
        <span>Click a row to expand details</span>
        <span>·</span>
        <span>All assignments synced from matrix</span>
      </div>
    </div>
  );
}
