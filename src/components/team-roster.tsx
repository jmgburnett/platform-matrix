"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  MagnifyingGlass, ArrowLeft, CaretDown, CaretRight,
  User, Envelope, Phone, Note, Plus,
} from "@phosphor-icons/react";
import { JDS, JD_TITLES, findJDByTitle, jdKeyToLayerId, emptyJD, type JobDescription } from "@/lib/job-descriptions";
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
  status: "employee" | "provisional" | "";
  isEngineeringManager?: boolean;
  engineeringManager?: string; // name of assigned EM
  isProductManager?: boolean;
  productManager?: string;
  isDesignManager?: boolean;
  designManager?: string;
  isProgramManager?: boolean;
  programManager?: string;
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

/* ─── JD View Modal ─── */
function JDModal({ jd, onClose, onEdit, accent }: { jd: JobDescription; onClose: () => void; onEdit?: () => void; accent?: string }) {
  const color = accent || "#06b6d4";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 32,
        maxWidth: 640, width: "90%", maxHeight: "85vh", overflow: "auto", color: "#e2e8f0",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ borderLeft: `4px solid ${color}`, paddingLeft: 16, marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>{jd.title}</h3>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Reports to {jd.reports || "—"}</p>
        </div>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 20 }}>{jd.what}</p>

        <h4 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color, marginBottom: 8 }}>Responsibilities</h4>
        {jd.responsibilities.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "start" }}>
            <span style={{ color, fontSize: 10, marginTop: 4 }}>●</span>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>{r}</p>
          </div>
        ))}

        <div style={{ height: 1, background: "#1e293b", margin: "16px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#06b6d4", marginBottom: 8 }}>Looking For</h4>
            {jd.looking.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "start" }}>
                <span style={{ color: "#06b6d4", fontSize: 8, marginTop: 5 }}>◆</span>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#10b981", marginBottom: 8 }}>Success Looks Like</h4>
            {jd.success.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "start" }}>
                <span style={{ color: "#10b981", fontSize: 8, marginTop: 5 }}>◆</span>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: 0 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        {jd.notThis && (
          <div style={{ background: "#1a0a0a", border: "1px solid #7f1d1d40", borderRadius: 10, padding: "10px 14px", marginTop: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Not This</p>
            <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic", margin: 0 }}>{jd.notThis}</p>
          </div>
        )}

        {jd.flourishing && (
          <div style={{ background: "#0a1a1a", border: "1px solid #06b6d440", borderRadius: 10, padding: "10px 14px", marginTop: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>On Human Flourishing</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{jd.flourishing}</p>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          {onEdit && (
            <button onClick={onEdit} style={{
              background: "#1e3a5f", border: "1px solid #3b82f6", borderRadius: 8, padding: "8px 20px",
              color: "#60a5fa", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600,
            }}>Edit</button>
          )}
          <button onClick={onClose} style={{
            background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 20px",
            color: "#94a3b8", cursor: "pointer", fontSize: 12, fontFamily: "inherit",
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── JD Editor Modal ─── */
function JDEditorModal({ initial, onSave, onClose }: {
  initial?: JobDescription; onSave: (jd: JobDescription) => void; onClose: () => void;
}) {
  const [jd, setJd] = useState<JobDescription>(initial || emptyJD());
  const [respInput, setRespInput] = useState("");
  const [lookInput, setLookInput] = useState("");
  const [successInput, setSuccessInput] = useState("");

  const update = (field: keyof JobDescription, value: any) => setJd(prev => ({ ...prev, [field]: value }));

  const inputStyle: React.CSSProperties = {
    background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px",
    color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%",
  };
  const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: "vertical" };
  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b",
    display: "block", marginBottom: 6,
  };

  const addToList = (field: "responsibilities" | "looking" | "success", value: string, setter: (v: string) => void) => {
    const trimmed = value.trim();
    if (trimmed) {
      update(field, [...jd[field], trimmed]);
      setter("");
    }
  };

  const removeFromList = (field: "responsibilities" | "looking" | "success", idx: number) => {
    update(field, jd[field].filter((_, i) => i !== idx));
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 28,
        maxWidth: 640, width: "90%", maxHeight: "85vh", overflow: "auto", color: "#e2e8f0",
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", margin: "0 0 20px" }}>
          {initial ? "Edit Job Description" : "New Job Description"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input value={jd.title} onChange={e => update("title", e.target.value)} placeholder="e.g. Platform Solution Engineer" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Reports To</label>
            <input value={jd.reports} onChange={e => update("reports", e.target.value)} placeholder="Manager name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>What This Role Is</label>
            <textarea value={jd.what} onChange={e => update("what", e.target.value)} placeholder="Describe the role..." style={textareaStyle} />
          </div>

          {/* Responsibilities */}
          <div>
            <label style={labelStyle}>Responsibilities</label>
            {jd.responsibilities.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#06b6d4" }}>●</span>
                <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{r}</span>
                <button onClick={() => removeFromList("responsibilities", i)}
                  style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14 }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6 }}>
              <input value={respInput} onChange={e => setRespInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addToList("responsibilities", respInput, setRespInput); } }}
                placeholder="Add responsibility..." style={{ ...inputStyle, fontSize: 12 }} />
              <button onClick={() => addToList("responsibilities", respInput, setRespInput)}
                style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "0 12px", color: "#64748b", cursor: "pointer", fontSize: 16 }}>+</button>
            </div>
          </div>

          {/* Looking For */}
          <div>
            <label style={labelStyle}>Looking For</label>
            {jd.looking.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "center" }}>
                <span style={{ fontSize: 8, color: "#06b6d4" }}>◆</span>
                <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{l}</span>
                <button onClick={() => removeFromList("looking", i)}
                  style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14 }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6 }}>
              <input value={lookInput} onChange={e => setLookInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addToList("looking", lookInput, setLookInput); } }}
                placeholder="Add requirement..." style={{ ...inputStyle, fontSize: 12 }} />
              <button onClick={() => addToList("looking", lookInput, setLookInput)}
                style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "0 12px", color: "#64748b", cursor: "pointer", fontSize: 16 }}>+</button>
            </div>
          </div>

          {/* Success Looks Like */}
          <div>
            <label style={labelStyle}>Success Looks Like</label>
            {jd.success.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "center" }}>
                <span style={{ fontSize: 8, color: "#10b981" }}>◆</span>
                <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{s}</span>
                <button onClick={() => removeFromList("success", i)}
                  style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14 }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6 }}>
              <input value={successInput} onChange={e => setSuccessInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addToList("success", successInput, setSuccessInput); } }}
                placeholder="Add success metric..." style={{ ...inputStyle, fontSize: 12 }} />
              <button onClick={() => addToList("success", successInput, setSuccessInput)}
                style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "0 12px", color: "#64748b", cursor: "pointer", fontSize: 16 }}>+</button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Not This</label>
            <textarea value={jd.notThis} onChange={e => update("notThis", e.target.value)} placeholder="What this role is NOT..." style={{ ...textareaStyle, minHeight: 50 }} />
          </div>
          <div>
            <label style={labelStyle}>On Human Flourishing</label>
            <textarea value={jd.flourishing} onChange={e => update("flourishing", e.target.value)} placeholder="The deeper purpose..." style={{ ...textareaStyle, minHeight: 50 }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid #334155", borderRadius: 8, padding: "8px 18px",
            color: "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={() => { if (jd.title.trim()) onSave(jd); }}
            disabled={!jd.title.trim()}
            style={{
              background: jd.title.trim() ? "#1e3a5f" : "#1e293b",
              border: `1px solid ${jd.title.trim() ? "#3b82f6" : "#334155"}`,
              borderRadius: 8, padding: "8px 18px",
              color: jd.title.trim() ? "#60a5fa" : "#475569",
              cursor: jd.title.trim() ? "pointer" : "default",
              fontSize: 12, fontFamily: "inherit", fontWeight: 600,
            }}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Role Select with JD titles + custom ─── */
function RoleSelect({ value, onChange, compact, customJDTitles, onViewJD, onCreateJD }: {
  value: string; onChange: (v: string) => void; compact?: boolean;
  customJDTitles?: string[]; onViewJD?: (title: string) => void; onCreateJD?: () => void;
}) {
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

  const allRoles = [...JD_TITLES, ...(customJDTitles || []), ...customRoles.filter(r => !(customJDTitles || []).includes(r))];

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

  // Check if current value has a JD (built-in or custom)
  const hasJD = value && (findJDByTitle(value, undefined) !== null || (customJDTitles || []).includes(value));

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", width: "100%" }}>
      <select
        value={allRoles.includes(value) ? value : "__other__"}
        onChange={e => {
          const v = e.target.value;
          if (v === "__add__") { setAdding(true); return; }
          if (v === "__create_jd__") { onCreateJD?.(); return; }
          if (v === "__other__") return;
          onChange(v);
        }}
        style={{
          background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
          padding: compact ? "3px 8px" : "5px 8px", color: value ? "#cbd5e1" : "#64748b",
          fontSize: compact ? 11 : 12, fontFamily: "inherit", outline: "none", flex: 1,
          cursor: "pointer", appearance: "auto",
        }}
      >
        <option value="__other__" disabled={!value}>
          {value && !allRoles.includes(value) ? value : "Select role..."}
        </option>
        {allRoles.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
        <option value="__add__">＋ Add custom role...</option>
        <option value="__create_jd__">📄 Create new JD...</option>
      </select>
      {hasJD && onViewJD && (
        <button onClick={() => onViewJD(value)}
          title="View Job Description"
          style={{
            background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
            padding: compact ? "2px 6px" : "4px 8px", color: "#06b6d4", cursor: "pointer",
            fontSize: compact ? 10 : 11, fontFamily: "inherit", fontWeight: 600, whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#06b6d4"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; }}>
          JD
        </button>
      )}
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
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [viewJD, setViewJD] = useState<JobDescription | null>(null);
  const [viewJDKey, setViewJDKey] = useState<string | null>(null);
  const [editJD, setEditJD] = useState<boolean>(false);
  const [editJDInitial, setEditJDInitial] = useState<JobDescription | undefined>(undefined);
  const [editJDKey, setEditJDKey] = useState<string | null>(null);
  const [customJDs, setCustomJDs] = useState<Record<string, JobDescription>>({});

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

  // Load roster metadata + custom JDs
  useEffect(() => {
    if (loaded) return;
    if (convexRoster === undefined) return;
    if (convexRoster?.data) {
      try {
        const parsed = JSON.parse(convexRoster.data);
        if (parsed._customJDs) {
          setCustomJDs(parsed._customJDs);
          delete parsed._customJDs;
        }
        setRosterMeta(parsed);
      } catch {}
    }
    setLoaded(true);
  }, [convexRoster, loaded]);

  // Auto-save roster metadata + custom JDs
  useEffect(() => {
    if (!loaded) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaving(true);
      const dataToSave = { ...rosterMeta, _customJDs: customJDs };
      saveRoster({ key: "default", data: JSON.stringify(dataToSave) })
        .then(() => { setSaved(true); setSaving(false); setTimeout(() => setSaved(false), 2000); })
        .catch(() => setSaving(false));
    }, 800);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [rosterMeta, customJDs, loaded, saveRoster]);

  const people = useMemo(() => org ? extractPeople(org) : {}, [org]);

  const customJDTitles = useMemo(() => Object.values(customJDs).map(jd => jd.title), [customJDs]);

  const handleViewJD = (title: string) => {
    const found = findJDByTitle(title, customJDs);
    if (found) {
      setViewJD(found.jd);
      setViewJDKey(found.key);
    }
  };

  const handleEditJDFromView = () => {
    if (viewJD) {
      setEditJDInitial(viewJD);
      setEditJDKey(viewJDKey);
      setViewJD(null);
      setViewJDKey(null);
      setEditJD(true);
    }
  };

  const handleCreateJD = () => {
    setEditJDInitial(undefined);
    setEditJDKey(null);
    setEditJD(true);
  };

  const handleSaveJD = (jd: JobDescription) => {
    // Use existing key if editing, generate new one if creating
    const key = editJDKey || "custom_" + jd.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    setCustomJDs(prev => ({ ...prev, [key]: jd }));
    setEditJD(false);
    setEditJDKey(null);
  };

  const addPerson = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || rosterMeta[trimmed]) return;
    setRosterMeta(prev => ({ ...prev, [trimmed]: { role: "", capabilities: [], email: "", phone: "", notes: "", status: "" } }));
    setNewPersonName("");
    setShowAddPerson(false);
    setExpandedPerson(trimmed);
  };

  const getMeta = (name: string): RosterMeta => rosterMeta[name] || { role: "", capabilities: [], email: "", phone: "", notes: "", status: "" };
  const updateMeta = (name: string, updates: Partial<RosterMeta>) => {
    setRosterMeta(prev => ({ ...prev, [name]: { ...getMeta(name), ...updates } }));
  };

  // Engineering Manager helpers
  const toggleEMDesignation = (name: string) => {
    const meta = getMeta(name);
    const wasEM = !!meta.isEngineeringManager;
    updateMeta(name, { isEngineeringManager: !wasEM });
    // If removing EM designation, clear anyone who had them assigned
    if (wasEM) {
      setRosterMeta(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(pName => {
          if (next[pName]?.engineeringManager === name) {
            next[pName] = { ...next[pName], engineeringManager: undefined };
          }
        });
        return next;
      });
    }
  };

  const setPersonEM = (personName: string, emName: string | undefined) => {
    updateMeta(personName, { engineeringManager: emName });
  };

  // Product Manager helpers
  const togglePMDesignation = (name: string) => {
    const meta = getMeta(name);
    const wasPM = !!meta.isProductManager;
    updateMeta(name, { isProductManager: !wasPM });
    if (wasPM) {
      setRosterMeta(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(pName => {
          if (next[pName]?.productManager === name) {
            next[pName] = { ...next[pName], productManager: undefined };
          }
        });
        return next;
      });
    }
  };
  const setPersonPM = (personName: string, pmName: string | undefined) => {
    updateMeta(personName, { productManager: pmName });
  };

  // Design Manager helpers
  const toggleDMDesignation = (name: string) => {
    const meta = getMeta(name);
    const wasDM = !!meta.isDesignManager;
    updateMeta(name, { isDesignManager: !wasDM });
    if (wasDM) {
      setRosterMeta(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(pName => {
          if (next[pName]?.designManager === name) {
            next[pName] = { ...next[pName], designManager: undefined };
          }
        });
        return next;
      });
    }
  };
  const setPersonDM = (personName: string, dmName: string | undefined) => {
    updateMeta(personName, { designManager: dmName });
  };

  // Program Manager helpers
  const togglePgMDesignation = (name: string) => {
    const meta = getMeta(name);
    const wasPgM = !!meta.isProgramManager;
    updateMeta(name, { isProgramManager: !wasPgM });
    if (wasPgM) {
      setRosterMeta(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(pName => {
          if (next[pName]?.programManager === name) {
            next[pName] = { ...next[pName], programManager: undefined };
          }
        });
        return next;
      });
    }
  };
  const setPersonPgM = (personName: string, pgmName: string | undefined) => {
    updateMeta(personName, { programManager: pgmName });
  };

  // Get list of designated managers
  const engineeringManagers = useMemo(() => {
    return Object.entries(rosterMeta)
      .filter(([key, meta]) => key !== "_customJDs" && meta?.isEngineeringManager)
      .map(([name]) => name)
      .sort();
  }, [rosterMeta]);

  const productManagers = useMemo(() => {
    return Object.entries(rosterMeta)
      .filter(([key, meta]) => key !== "_customJDs" && meta?.isProductManager)
      .map(([name]) => name)
      .sort();
  }, [rosterMeta]);

  const designManagers = useMemo(() => {
    return Object.entries(rosterMeta)
      .filter(([key, meta]) => key !== "_customJDs" && meta?.isDesignManager)
      .map(([name]) => name)
      .sort();
  }, [rosterMeta]);

  const programManagers = useMemo(() => {
    return Object.entries(rosterMeta)
      .filter(([key, meta]) => key !== "_customJDs" && meta?.isProgramManager)
      .map(([name]) => name)
      .sort();
  }, [rosterMeta]);

  // Remove person from roster (metadata + matrix assignments)
  const removePerson = (personName: string) => {
    // Remove from roster metadata
    setRosterMeta(prev => {
      const next = { ...prev };
      delete next[personName];
      return next;
    });
    // Remove from all matrix product cells
    if (org) {
      const updated = {
        ...org,
        products: org.products.map((p: any) => {
          const newCells: any = { ...p.cells };
          Object.keys(newCells).forEach(layerId => {
            if (newCells[layerId]) {
              newCells[layerId] = newCells[layerId].filter((item: any) => item.name !== personName);
            }
          });
          return { ...p, cells: newCells };
        }),
      };
      saveOrgData(updated);
    }
    if (expandedPerson === personName) setExpandedPerson(null);
  };

  // When role changes, move person to the matching layer across their product assignments
  const updateRole = (personName: string, newRole: string) => {
    updateMeta(personName, { role: newRole });
    if (!org) return;

    // Find the JD and its layer
    const found = findJDByTitle(newRole, customJDs);
    if (!found) return;
    const targetLayerId = jdKeyToLayerId(found.key);
    if (!targetLayerId) return;

    // Check if layer exists in org
    const layerExists = org.layers.some((l: any) => l.id === targetLayerId);
    if (!layerExists) return;

    // Get current assignments for this person
    const currentAssignments: { productId: string; layerId: string; stage: string }[] = [];
    (org.products || []).forEach((p: any) => {
      Object.entries(p.cells || {}).forEach(([layerId, items]: [string, any]) => {
        (items || []).forEach((item: any) => {
          if (item.name === personName) {
            currentAssignments.push({ productId: p.id, layerId, stage: item.stage });
          }
        });
      });
    });

    // Move: remove from old layers, add to new layer (keep same products and stages)
    const productIds = [...new Set(currentAssignments.map(a => a.productId))];
    if (productIds.length === 0) return;

    // Check if already in the target layer for all products
    const alreadyCorrect = productIds.every(pid =>
      currentAssignments.some(a => a.productId === pid && a.layerId === targetLayerId)
    );
    if (alreadyCorrect) return;

    const updated = {
      ...org,
      products: org.products.map((p: any) => {
        if (!productIds.includes(p.id)) return p;
        const newCells: any = { ...p.cells };

        // Find this person's stage for this product (from any layer)
        const existing = currentAssignments.find(a => a.productId === p.id);
        const stage = existing?.stage || "stabilize";

        // Remove from all layers
        Object.keys(newCells).forEach(layerId => {
          if (newCells[layerId]) {
            newCells[layerId] = newCells[layerId].filter((item: any) => item.name !== personName);
          }
        });

        // Add to target layer
        if (!newCells[targetLayerId]) newCells[targetLayerId] = [];
        newCells[targetLayerId] = [...newCells[targetLayerId], { name: personName, stage }];

        return { ...p, cells: newCells };
      }),
    };
    saveOrgData(updated);
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

  // Change customer for an assignment (move from one product to another, same layer+stage)
  const changeProduct = (personName: string, oldProductId: string, layerId: string, newProductId: string) => {
    if (!org || oldProductId === newProductId) return;
    const oldProd = org.products.find((p: any) => p.id === oldProductId);
    const stage = oldProd?.cells?.[layerId]?.find((item: any) => item.name === personName)?.stage || "stabilize";
    // Remove from old
    const updated = {
      ...org,
      products: org.products.map((p: any) => {
        if (p.id === oldProductId) {
          const newCells = { ...p.cells };
          newCells[layerId] = (newCells[layerId] || []).filter((item: any) => item.name !== personName);
          return { ...p, cells: newCells };
        }
        if (p.id === newProductId) {
          const newCells = { ...p.cells };
          // Don't duplicate
          if (!(newCells[layerId] || []).some((item: any) => item.name === personName)) {
            newCells[layerId] = [...(newCells[layerId] || []), { name: personName, stage }];
          }
          return { ...p, cells: newCells };
        }
        return p;
      }),
    };
    saveOrgData(updated);
  };

  // Change layer for an assignment (move from one layer to another, same product+stage)
  const changeLayer = (personName: string, productId: string, oldLayerId: string, newLayerId: string) => {
    if (!org || oldLayerId === newLayerId) return;
    const prod = org.products.find((p: any) => p.id === productId);
    const stage = prod?.cells?.[oldLayerId]?.find((item: any) => item.name === personName)?.stage || "stabilize";
    const updated = {
      ...org,
      products: org.products.map((p: any) => {
        if (p.id !== productId) return p;
        const newCells = { ...p.cells };
        // Remove from old layer
        newCells[oldLayerId] = (newCells[oldLayerId] || []).filter((item: any) => item.name !== personName);
        // Add to new layer
        if (!(newCells[newLayerId] || []).some((item: any) => item.name === personName)) {
          newCells[newLayerId] = [...(newCells[newLayerId] || []), { name: personName, stage }];
        }
        return { ...p, cells: newCells };
      }),
    };
    saveOrgData(updated);
  };

  // Change stage for a person in a specific product+layer cell
  const changeStage = (personName: string, productId: string, layerId: string, newStage: string) => {
    if (!org) return;
    const updated = {
      ...org,
      products: org.products.map((p: any) => {
        if (p.id !== productId) return p;
        const newCells: any = { ...p.cells };
        newCells[layerId] = (newCells[layerId] || []).map((item: any) =>
          item.name === personName ? { ...item, stage: newStage } : item
        );
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

  // Merge roster-only people (in metadata but not in matrix)
  const allPeople = useMemo(() => {
    const merged = { ...people };
    Object.keys(rosterMeta).forEach(name => {
      if (name === "_customJDs") return;
      if (!merged[name]) {
        merged[name] = { name, assignments: [], layerLeaders: [], executives: [] };
      }
    });
    return merged;
  }, [people, rosterMeta]);

  // Filter & search
  const filteredPeople = useMemo(() => {
    return Object.values(allPeople).filter((person: any) => {
      const meta = getMeta(person.name);
      const matchesSearch = !search ||
        person.name.toLowerCase().includes(search.toLowerCase()) ||
        meta.role.toLowerCase().includes(search.toLowerCase()) ||
        meta.capabilities.some((c: string) => c.toLowerCase().includes(search.toLowerCase()));
      const matchesLayer = filterLayer === "all" ||
        (filterLayer === "__unassigned__" ? person.assignments.length === 0 : person.assignments.some((a: any) => a.layerId === filterLayer));
      const matchesProduct = filterProduct === "all" || person.assignments.some((a: any) => a.productId === filterProduct);
      if (filterProduct !== "all" && person.assignments.length === 0) return false;
      return matchesSearch && matchesLayer && matchesProduct;
    }).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [allPeople, search, filterLayer, filterProduct, rosterMeta]);

  // Count stats
  const totalPeople = Object.keys(allPeople).length;

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
      {/* JD Modals */}
      {showAddPerson && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowAddPerson(false)}>
          <form onSubmit={e => { e.preventDefault(); addPerson(newPersonName); }} onClick={e => e.stopPropagation()} style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 28,
            maxWidth: 400, width: "90%", color: "#e2e8f0",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", margin: "0 0 16px" }}>Add Person</h3>
            <input value={newPersonName} onChange={e => setNewPersonName(e.target.value)} autoFocus
              placeholder="Full name..."
              style={{
                width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
                padding: "10px 14px", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none",
                boxSizing: "border-box",
              }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <button type="button" onClick={() => setShowAddPerson(false)} style={{
                background: "none", border: "1px solid #334155", borderRadius: 8, padding: "8px 18px",
                color: "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "inherit",
              }}>Cancel</button>
              <button type="submit" disabled={!newPersonName.trim()} style={{
                background: newPersonName.trim() ? "#064e3b" : "#1e293b",
                border: `1px solid ${newPersonName.trim() ? "#10b981" : "#334155"}`,
                borderRadius: 8, padding: "8px 18px",
                color: newPersonName.trim() ? "#10b981" : "#475569",
                cursor: newPersonName.trim() ? "pointer" : "default",
                fontSize: 12, fontFamily: "inherit", fontWeight: 600,
              }}>Add</button>
            </div>
          </form>
        </div>
      )}
      {viewJD && <JDModal jd={viewJD} onClose={() => { setViewJD(null); setViewJDKey(null); }} onEdit={handleEditJDFromView} />}
      {editJD && <JDEditorModal initial={editJDInitial} onSave={handleSaveJD} onClose={() => setEditJD(false)} />}

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
            <button onClick={() => setShowAddPerson(true)} style={{
              display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 20, padding: "6px 14px",
              fontSize: 12, fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)", cursor: "pointer", transition: "all 0.15s",
            }}>
              + Add Person
            </button>
            <a href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 20, padding: "6px 14px",
              fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)",
              textDecoration: "none", transition: "all 0.15s", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <ArrowLeft size={12} /> Matrix View
            </a>
            <a href="/customers" style={{
              display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 20, padding: "6px 14px",
              fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)",
              textDecoration: "none", transition: "all 0.15s", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              🏢 Customers
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
          <option value="__unassigned__">Unassigned</option>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "#0c0f1a", borderRadius: 12, border: "1px solid #1e293b", overflow: "hidden" }}>
        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(180px, 1.2fr) minmax(140px, 1fr) minmax(60px, 0.4fr) minmax(90px, 0.7fr) minmax(85px, 0.55fr) minmax(85px, 0.55fr) minmax(80px, 0.55fr) minmax(85px, 0.55fr) minmax(90px, 0.6fr) minmax(100px, 0.7fr)",
          gap: 0, padding: "8px 16px",
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#475569" }}>Name</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#475569" }}>Role</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#475569" }}>Stage</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#475569" }}>Reports To</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#818cf8" }}>Eng. Mgr</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#f472b6" }}>Prod. Mgr</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#f97316" }}>Design Mgr</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#10b981" }}>Prog. Mgr</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#475569" }}>Customers</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#475569" }}>Capabilities</span>
        </div>

        {filteredPeople.map((person: any) => {
          const meta = getMeta(person.name);
          const isExpanded = expandedPerson === person.name;
          const uniqueLayers = [...new Map(person.assignments.map((a: any) => [a.layerId, a])).values()];
          const uniqueProducts = [...new Map(person.assignments.map((a: any) => [a.productId, a])).values()];

          return (
            <div key={person.name}>
              <div
                onClick={() => setExpandedPerson(isExpanded ? null : person.name)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px, 1.2fr) minmax(140px, 1fr) minmax(60px, 0.4fr) minmax(90px, 0.7fr) minmax(85px, 0.55fr) minmax(85px, 0.55fr) minmax(80px, 0.55fr) minmax(85px, 0.55fr) minmax(90px, 0.6fr) minmax(100px, 0.7fr)",
                  gap: 0, padding: "10px 16px",
                  alignItems: "center",
                  background: isExpanded ? "#111827" : "transparent",
                  borderBottom: "1px solid #131820",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {/* Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 12 }}>
                    {isExpanded ? <CaretDown size={10} weight="bold" color="#475569" /> : <CaretRight size={10} weight="bold" color="#334155" />}
                  </div>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0,
                    background: `linear-gradient(135deg, ${person.assignments[0] ? (TYPE_COLORS[person.assignments[0].productType] || "#6366f1") + "30" : "#1e293b"}, #1e293b)`,
                    color: "#94a3b8", border: "1px solid #1e293b",
                  }}>
                    {person.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.2 }}>
                        <ET value={person.name} onChange={v => renamePerson(person.name, v)} style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }} />
                      </div>
                      {meta.status === "provisional" && (
                        <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, fontWeight: 700, background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b30", whiteSpace: "nowrap" }}>PROVISIONAL</span>
                      )}
                      {meta.isEngineeringManager && (
                        <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, fontWeight: 700, background: "#6366f120", color: "#818cf8", border: "1px solid #6366f130", whiteSpace: "nowrap" }}>EM</span>
                      )}
                      {meta.isProductManager && (
                        <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, fontWeight: 700, background: "#f472b620", color: "#f472b6", border: "1px solid #f472b630", whiteSpace: "nowrap" }}>PM</span>
                      )}
                      {meta.isDesignManager && (
                        <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, fontWeight: 700, background: "#f9731620", color: "#f97316", border: "1px solid #f9731630", whiteSpace: "nowrap" }}>DM</span>
                      )}
                      {meta.isProgramManager && (
                        <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, fontWeight: 700, background: "#10b98120", color: "#10b981", border: "1px solid #10b98130", whiteSpace: "nowrap" }}>PgM</span>
                      )}
                    </div>
                    {meta.engineeringManager && (
                      <div style={{ fontSize: 10, color: "#818cf8", marginTop: 1 }}>
                        ↳ EM: {meta.engineeringManager}
                      </div>
                    )}
                    {!meta.engineeringManager && person.layerLeaders.length > 0 && (
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>
                        {[...new Set(person.assignments.map((a: any) => a.layerLabel))].slice(0, 2).join(" · ")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div style={{ display: "flex", alignItems: "center" }} onClick={e => e.stopPropagation()}>
                  {meta.role ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>{meta.role}</span>
                      {(findJDByTitle(meta.role, customJDs) !== null) && (
                        <button onClick={() => handleViewJD(meta.role)} title="View JD"
                          style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 4, padding: "1px 5px", color: "#06b6d4", cursor: "pointer", fontSize: 9, fontWeight: 700, transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#06b6d4"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; }}>JD</button>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: "#334155" }}>—</span>
                  )}
                </div>

                {/* Stage */}
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                  {(() => {
                    const stages = Array.from<string>(new Set(person.assignments.map((a: any) => String(a.stage))));
                    return stages.length > 0 ? stages.map((s) => (
                      <span key={s} style={{
                        fontSize: 9, padding: "2px 7px", borderRadius: 4, fontWeight: 700,
                        background: (STAGES[s]?.color || "#94a3b8") + "20",
                        color: STAGES[s]?.color || "#94a3b8",
                        border: `1px solid ${(STAGES[s]?.color || "#94a3b8")}30`,
                      }}>
                        {STAGES[s]?.label || s}
                      </span>
                    )) : <span style={{ fontSize: 11, color: "#334155" }}>—</span>;
                  })()}
                </div>

                {/* Reports To */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {person.layerLeaders.length > 0 ? (
                    person.layerLeaders.slice(0, 2).map((ll: any, i: number) => (
                      <span key={i} style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{ll.leaderName}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: 11, color: "#334155" }}>—</span>
                  )}
                </div>

                {/* Engineering Manager */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {meta.engineeringManager ? (
                    <span style={{ fontSize: 11, color: "#818cf8", lineHeight: 1.4 }}>{meta.engineeringManager}</span>
                  ) : meta.isEngineeringManager ? (
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 700, background: "#6366f120", color: "#818cf8", border: "1px solid #6366f130", display: "inline-block", width: "fit-content" }}>IS EM</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#334155" }}>—</span>
                  )}
                </div>

                {/* Product Manager */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {meta.productManager ? (
                    <span style={{ fontSize: 11, color: "#f472b6", lineHeight: 1.4 }}>{meta.productManager}</span>
                  ) : meta.isProductManager ? (
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 700, background: "#f472b620", color: "#f472b6", border: "1px solid #f472b630", display: "inline-block", width: "fit-content" }}>IS PM</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#334155" }}>—</span>
                  )}
                </div>

                {/* Design Manager */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {meta.designManager ? (
                    <span style={{ fontSize: 11, color: "#f97316", lineHeight: 1.4 }}>{meta.designManager}</span>
                  ) : meta.isDesignManager ? (
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 700, background: "#f9731620", color: "#f97316", border: "1px solid #f9731630", display: "inline-block", width: "fit-content" }}>IS DM</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#334155" }}>—</span>
                  )}
                </div>

                {/* Program Manager */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {meta.programManager ? (
                    <span style={{ fontSize: 11, color: "#10b981", lineHeight: 1.4 }}>{meta.programManager}</span>
                  ) : meta.isProgramManager ? (
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 700, background: "#10b98120", color: "#10b981", border: "1px solid #10b98130", display: "inline-block", width: "fit-content" }}>IS PgM</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#334155" }}>—</span>
                  )}
                </div>

                {/* Customers */}
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                  {uniqueProducts.length > 0 ? uniqueProducts.map((a: any) => (
                    <span key={a.productId} style={{
                      fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 600,
                      background: (TYPE_COLORS[a.productType] || "#6366f1") + "15",
                      color: (TYPE_COLORS[a.productType] || "#6366f1") + "cc",
                      border: `1px solid ${(TYPE_COLORS[a.productType] || "#6366f1")}20`,
                    }}>
                      {a.productName}
                    </span>
                  )) : (
                    <span style={{ fontSize: 11, color: "#334155" }}>—</span>
                  )}
                </div>

                {/* Capabilities */}
                <div style={{ display: "flex", alignItems: "center", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                  {meta.capabilities.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {meta.capabilities.slice(0, 3).map((c, i) => (
                        <span key={i} style={{
                          fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "#1e293b",
                          border: "1px solid #252d3a", color: "#64748b", whiteSpace: "nowrap",
                        }}>{c}</span>
                      ))}
                      {meta.capabilities.length > 3 && (
                        <span style={{ fontSize: 9, color: "#334155" }}>+{meta.capabilities.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: "#334155" }}>—</span>
                  )}
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
                        <RoleSelect value={meta.role} onChange={v => updateRole(person.name, v)}
                          customJDTitles={customJDTitles} onViewJD={handleViewJD} onCreateJD={handleCreateJD} />
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
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "block", marginBottom: 6 }}>
                          Team Status
                        </label>
                        <select value={meta.status || ""} onChange={e => updateMeta(person.name, { status: e.target.value as RosterMeta["status"] })}
                          style={{
                            background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
                            padding: "6px 10px", color: meta.status === "provisional" ? "#f59e0b" : meta.status === "employee" ? "#10b981" : "#64748b",
                            fontSize: 12, fontFamily: "inherit", outline: "none", cursor: "pointer", width: "100%",
                          }}>
                          <option value="">Not set</option>
                          <option value="employee">Gloo Employee</option>
                          <option value="provisional">Provisional</option>
                        </select>
                      </div>

                      {/* Engineering Manager */}
                      <div style={{ borderTop: "1px solid #1e293b", paddingTop: 14 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#818cf8", display: "block", marginBottom: 8 }}>
                          Engineering Manager
                        </label>
                        {/* Designation toggle */}
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "8px 12px", background: "#0f172a", borderRadius: 8,
                          border: meta.isEngineeringManager ? "1px solid #6366f140" : "1px solid #1e293b",
                          marginBottom: 10,
                        }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>EM Designation</div>
                            <div style={{ fontSize: 10, color: "#475569" }}>Mark as an engineering manager</div>
                          </div>
                          <button
                            onClick={() => toggleEMDesignation(person.name)}
                            style={{
                              borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 600,
                              cursor: "pointer", transition: "all 0.15s", border: "1px solid",
                              fontFamily: "inherit",
                              ...(meta.isEngineeringManager
                                ? { background: "#6366f1", borderColor: "#6366f1", color: "white" }
                                : { background: "#1e293b", borderColor: "#334155", color: "#64748b" }),
                            }}
                          >
                            {meta.isEngineeringManager ? "✓ Designated" : "Designate"}
                          </button>
                        </div>
                        {/* Assign EM */}
                        <div style={{
                          padding: "8px 12px", background: "#0f172a", borderRadius: 8,
                          border: "1px solid #1e293b",
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Assigned Engineering Manager</div>
                          {engineeringManagers.length === 0 ? (
                            <div style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>
                              No engineering managers designated yet
                            </div>
                          ) : (
                            <select
                              value={meta.engineeringManager || ""}
                              onChange={e => setPersonEM(person.name, e.target.value || undefined)}
                              style={{
                                width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
                                padding: "5px 8px", color: meta.engineeringManager ? "#818cf8" : "#475569",
                                fontSize: 12, fontFamily: "inherit", outline: "none", cursor: "pointer",
                              }}
                            >
                              <option value="">No manager assigned</option>
                              {engineeringManagers.filter(n => n !== person.name).map(emName => (
                                <option key={emName} value={emName}>{emName}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Product Manager */}
                      <div style={{ borderTop: "1px solid #1e293b", paddingTop: 14 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#f472b6", display: "block", marginBottom: 8 }}>
                          Product Manager
                        </label>
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "8px 12px", background: "#0f172a", borderRadius: 8,
                          border: meta.isProductManager ? "1px solid #f472b640" : "1px solid #1e293b",
                          marginBottom: 10,
                        }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>PM Designation</div>
                            <div style={{ fontSize: 10, color: "#475569" }}>Mark as a product manager</div>
                          </div>
                          <button
                            onClick={() => togglePMDesignation(person.name)}
                            style={{
                              borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 600,
                              cursor: "pointer", transition: "all 0.15s", border: "1px solid",
                              fontFamily: "inherit",
                              ...(meta.isProductManager
                                ? { background: "#f472b6", borderColor: "#f472b6", color: "white" }
                                : { background: "#1e293b", borderColor: "#334155", color: "#64748b" }),
                            }}
                          >
                            {meta.isProductManager ? "✓ Designated" : "Designate"}
                          </button>
                        </div>
                        <div style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Assigned Product Manager</div>
                          {productManagers.length === 0 ? (
                            <div style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>No product managers designated yet</div>
                          ) : (
                            <select value={meta.productManager || ""} onChange={e => setPersonPM(person.name, e.target.value || undefined)}
                              style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "5px 8px", color: meta.productManager ? "#f472b6" : "#475569", fontSize: 12, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                              <option value="">No manager assigned</option>
                              {productManagers.filter(n => n !== person.name).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Design Manager */}
                      <div style={{ borderTop: "1px solid #1e293b", paddingTop: 14 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#f97316", display: "block", marginBottom: 8 }}>
                          Design Manager
                        </label>
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "8px 12px", background: "#0f172a", borderRadius: 8,
                          border: meta.isDesignManager ? "1px solid #f9731640" : "1px solid #1e293b",
                          marginBottom: 10,
                        }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>DM Designation</div>
                            <div style={{ fontSize: 10, color: "#475569" }}>Mark as a design manager</div>
                          </div>
                          <button
                            onClick={() => toggleDMDesignation(person.name)}
                            style={{
                              borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 600,
                              cursor: "pointer", transition: "all 0.15s", border: "1px solid",
                              fontFamily: "inherit",
                              ...(meta.isDesignManager
                                ? { background: "#f97316", borderColor: "#f97316", color: "white" }
                                : { background: "#1e293b", borderColor: "#334155", color: "#64748b" }),
                            }}
                          >
                            {meta.isDesignManager ? "✓ Designated" : "Designate"}
                          </button>
                        </div>
                        <div style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Assigned Design Manager</div>
                          {designManagers.length === 0 ? (
                            <div style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>No design managers designated yet</div>
                          ) : (
                            <select value={meta.designManager || ""} onChange={e => setPersonDM(person.name, e.target.value || undefined)}
                              style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "5px 8px", color: meta.designManager ? "#f97316" : "#475569", fontSize: 12, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                              <option value="">No manager assigned</option>
                              {designManagers.filter(n => n !== person.name).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Program Manager */}
                      <div style={{ borderTop: "1px solid #1e293b", paddingTop: 14 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#10b981", display: "block", marginBottom: 8 }}>
                          Program Manager
                        </label>
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "8px 12px", background: "#0f172a", borderRadius: 8,
                          border: meta.isProgramManager ? "1px solid #10b98140" : "1px solid #1e293b",
                          marginBottom: 10,
                        }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>PgM Designation</div>
                            <div style={{ fontSize: 10, color: "#475569" }}>Mark as a program manager</div>
                          </div>
                          <button
                            onClick={() => togglePgMDesignation(person.name)}
                            style={{
                              borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 600,
                              cursor: "pointer", transition: "all 0.15s", border: "1px solid",
                              fontFamily: "inherit",
                              ...(meta.isProgramManager
                                ? { background: "#10b981", borderColor: "#10b981", color: "white" }
                                : { background: "#1e293b", borderColor: "#334155", color: "#64748b" }),
                            }}
                          >
                            {meta.isProgramManager ? "✓ Designated" : "Designate"}
                          </button>
                        </div>
                        <div style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Assigned Program Manager</div>
                          {programManagers.length === 0 ? (
                            <div style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>No program managers designated yet</div>
                          ) : (
                            <select value={meta.programManager || ""} onChange={e => setPersonPgM(person.name, e.target.value || undefined)}
                              style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "5px 8px", color: meta.programManager ? "#10b981" : "#475569", fontSize: 12, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                              <option value="">No manager assigned</option>
                              {programManagers.filter(n => n !== person.name).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          )}
                        </div>
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
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <select value={a.productId}
                                  onChange={e => changeProduct(person.name, a.productId, a.layerId, e.target.value)}
                                  style={{
                                    fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 700,
                                    background: (TYPE_COLORS[a.productType] || "#6366f1") + "20",
                                    color: TYPE_COLORS[a.productType] || "#6366f1",
                                    border: `1px solid ${(TYPE_COLORS[a.productType] || "#6366f1")}30`,
                                    outline: "none", cursor: "pointer", fontFamily: "inherit",
                                  }}>
                                  {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <span style={{ fontSize: 11, color: "#475569" }}>→</span>
                                <select value={a.layerId}
                                  onChange={e => changeLayer(person.name, a.productId, a.layerId, e.target.value)}
                                  style={{
                                    fontSize: 10, padding: "1px 6px", borderRadius: 4,
                                    background: "#1e293b", color: "#94a3b8",
                                    border: "1px solid #334155",
                                    outline: "none", cursor: "pointer", fontFamily: "inherit",
                                  }}>
                                  {layers.map((l: any) => <option key={l.id} value={l.id}>{l.label}</option>)}
                                </select>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <select value={a.stage}
                                  onChange={e => changeStage(person.name, a.productId, a.layerId, e.target.value)}
                                  style={{
                                    fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 600,
                                    background: STAGES[a.stage]?.color + "20",
                                    color: STAGES[a.stage]?.color || "#94a3b8",
                                    border: `1px solid ${(STAGES[a.stage]?.color || "#94a3b8")}30`,
                                    outline: "none", cursor: "pointer", fontFamily: "inherit",
                                    appearance: "auto",
                                  }}>
                                  <option value="stabilize">Stabilize</option>
                                  <option value="modernize">Modernize</option>
                                  <option value="productize">Productize</option>
                                  <option value="all">All Stages</option>
                                </select>
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

                      {/* Accountable To — product leads for assigned customers */}
                      {(() => {
                        const productLeads = [...new Map(
                          person.assignments.map((a: any) => {
                            const prod = org.products.find((p: any) => p.id === a.productId);
                            return [a.productId, { productName: prod?.name || a.productName, productType: prod?.type || a.productType, productLead: prod?.productLead || "TBD" }];
                          })
                        ).values()];
                        return productLeads.length > 0 ? (
                          <div>
                            <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", display: "block", marginBottom: 8 }}>
                              Accountable To
                            </label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {productLeads.map((pl: any, i: number) => (
                                <div key={i} style={{
                                  display: "flex", alignItems: "center", justifyContent: "space-between",
                                  padding: "6px 10px", background: "#0f172a", borderRadius: 8,
                                  border: "1px solid #1e293b",
                                }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{pl.productLead}</span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{
                                      fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 600,
                                      background: (TYPE_COLORS[pl.productType] || "#6366f1") + "15",
                                      color: (TYPE_COLORS[pl.productType] || "#6366f1") + "cc",
                                      border: `1px solid ${(TYPE_COLORS[pl.productType] || "#6366f1")}20`,
                                    }}>{pl.productName}</span>
                                    <span style={{ fontSize: 10, color: "#475569" }}>Product Lead</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Remove person */}
                  <div style={{ borderTop: "1px solid #1e293b", marginTop: 16, paddingTop: 12, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => { if (confirm(`Remove ${person.name} from roster?`)) removePerson(person.name); }}
                      style={{
                        background: "none", border: "1px solid #7f1d1d40", borderRadius: 8,
                        padding: "6px 16px", color: "#ef4444", cursor: "pointer", fontSize: 11,
                        fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#7f1d1d20"; e.currentTarget.style.borderColor = "#ef4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#7f1d1d40"; }}>
                      Remove from Roster
                    </button>
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
