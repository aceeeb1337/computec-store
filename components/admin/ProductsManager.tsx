"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, ProductSource } from "@/lib/types";
import { formatPKR, CATEGORY_OPTIONS } from "@/lib/format";

type FormState = Record<string, string>;

const EMPTY: FormState = {
  name: "", category: "components", brand: "", price: "", oldPrice: "",
  stock: "", rating: "4.6", reviews: "0", badge: "", description: "", specs: "",
};

function toForm(p: Product): FormState {
  return {
    name: p.name, category: p.category, brand: p.brand,
    price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : "",
    stock: String(p.stock), rating: String(p.rating), reviews: String(p.reviews),
    badge: p.badge, description: p.description, specs: p.specs,
  };
}

interface Editing {
  id: string | null;
  form: FormState;
  images: string[];
}

const inputStyle: React.CSSProperties = {
  width: "100%", marginTop: 5, padding: "9px 11px", border: "1px solid #e6e4dd",
  borderRadius: 6, fontSize: 13.5, fontFamily: "var(--font-manrope)", outline: "none", background: "#fff",
};
const label: React.CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: "#a29e95" };
const colName = (id: string) => CATEGORY_OPTIONS.find((c) => c.id === id)?.name || id;

export default function ProductsManager({ products, source }: { products: Product[]; source: ProductSource }) {
  const router = useRouter();
  const readOnly = source === "sheet";
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => (p.name + " " + p.brand + " " + p.category).toLowerCase().includes(q));
  }, [products, query]);

  const openAdd = () => { setError(""); setEditing({ id: null, form: { ...EMPTY }, images: [] }); };
  const openEdit = (p: Product) => { setError(""); setEditing({ id: p.id, form: toForm(p), images: [...p.images] }); };
  const setField = (k: string, v: string) => setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));
  const setImage = (i: number, v: string) => setEditing((e) => (e ? { ...e, images: e.images.map((u, j) => (j === i ? v : u)) } : e));
  const addImage = () => setEditing((e) => (e ? { ...e, images: [...e.images, ""] } : e));
  const removeImage = (i: number) => setEditing((e) => (e ? { ...e, images: e.images.filter((_, j) => j !== i) } : e));

  const save = async () => {
    if (!editing) return;
    if (!editing.form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");
    try {
      const url = editing.id ? `/api/products/${editing.id}` : "/api/products";
      const res = await fetch(url, {
        method: editing.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing.form, images: editing.images.map((u) => u.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error();
      setEditing(null);
      router.refresh();
    } catch {
      setError("Couldn't save — try again");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    setConfirmId(null);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const runImport = async () => {
    setImporting(true);
    setImportMsg(null);
    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim(), mode: importMode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportMsg({ ok: false, text: data.error || "Import failed" });
        return;
      }
      setImportMsg({ ok: true, text: `Imported ${data.imported} row${data.imported === 1 ? "" : "s"}. Catalog now has ${data.total} products.` });
      router.refresh();
    } catch {
      setImportMsg({ ok: false, text: "Import failed — check the link and try again." });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1efe9", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14 }}>
          PRODUCTS <span style={{ color: "#a29e95", fontWeight: 700 }}>· {products.length}</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" style={{ ...inputStyle, marginTop: 0, width: 220 }} />
          {!readOnly && (
            <>
              <button onClick={() => { setImportMsg(null); setShowImport(true); }} style={{ background: "#f3f2ee", color: "#55555a", fontWeight: 700, fontSize: 13, padding: "10px 16px", borderRadius: 6 }}>Import from Sheet</button>
              <button onClick={openAdd} style={{ background: "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13, padding: "10px 16px", borderRadius: 6 }}>+ Add product</button>
            </>
          )}
        </div>
      </div>

      {readOnly && (
        <div style={{ margin: 16, background: "#fff8f3", border: "1px solid #ffd9bf", borderRadius: 6, padding: "11px 13px", fontSize: 12.5, color: "#c44e07", fontWeight: 600 }}>
          Catalog is synced from Google Sheets (read-only here). Remove SHEET_CSV_URL to manage products from the dashboard.
        </div>
      )}

      {/* header row */}
      <div style={{ display: "grid", gridTemplateColumns: "46px 2.4fr 1.2fr 1.3fr 0.7fr 0.7fr 1.1fr", gap: 10, padding: "10px 20px", fontSize: 11, fontWeight: 800, color: "#a29e95", letterSpacing: "0.04em", borderBottom: "1px solid #f6f5f1" }}>
        <span></span><span>PRODUCT</span><span>CATEGORY</span><span>PRICE</span><span>STOCK</span><span>BADGE</span><span style={{ textAlign: "right" }}>ACTIONS</span>
      </div>

      {filtered.map((p) => (
        <div key={p.id} style={{ display: "grid", gridTemplateColumns: "46px 2.4fr 1.2fr 1.3fr 0.7fr 0.7fr 1.1fr", gap: 10, padding: "12px 20px", borderBottom: "1px solid #f6f5f1", alignItems: "center", fontSize: 13 }}>
          <div style={{ width: 38, height: 38, borderRadius: 6, background: "#f6f5f1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ width: "78%", height: 24, borderRadius: 4, background: p.tile, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: "#28282b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#a29e95", fontWeight: 700, marginTop: 2 }}>{p.brand}</div>
          </div>
          <div style={{ color: "#55555a", fontSize: 12.5 }}>{colName(p.category)}</div>
          <div>
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, color: "#1c1d21" }}>{formatPKR(p.price)}</span>
            {p.oldPrice > p.price && p.oldPrice > 0 && <span style={{ fontSize: 11, color: "#b3b0a9", textDecoration: "line-through", marginLeft: 6 }}>{formatPKR(p.oldPrice)}</span>}
          </div>
          <div style={{ fontWeight: 700, color: p.stock <= 8 ? "#cc3344" : "#1f8a4c" }}>{p.stock}</div>
          <div>{p.badge ? <span style={{ background: "#f3f2ee", padding: "3px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700, color: "#55555a" }}>{p.badge}</span> : <span style={{ color: "#cfcdc6" }}>—</span>}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
            {readOnly ? (
              <span style={{ color: "#cfcdc6", fontSize: 12 }}>—</span>
            ) : confirmId === p.id ? (
              <>
                <button onClick={() => remove(p.id)} style={{ color: "#cc3344", fontWeight: 700, fontSize: 12.5 }}>Confirm</button>
                <button onClick={() => setConfirmId(null)} style={{ color: "#8a8a8f", fontWeight: 700, fontSize: 12.5 }}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => openEdit(p)} style={{ color: "#ff6a1a", fontWeight: 700, fontSize: 12.5 }}>Edit</button>
                <button onClick={() => setConfirmId(p.id)} className="remove-x" style={{ color: "#c9c5bc", fontWeight: 700, fontSize: 12.5 }}>Delete</button>
              </>
            )}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#8a8a8f", fontSize: 13 }}>No products match “{query}”.</div>
      )}

      {/* add / edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !saving && setEditing(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(20,20,24,0.5)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 640, padding: 24 }}
            >
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 18, marginBottom: 16 }}>{editing.id ? "Edit product" : "Add product"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={{ gridColumn: "span 2" }}><span style={label}>NAME *</span><input value={editing.form.name} onChange={(e) => setField("name", e.target.value)} style={inputStyle} /></label>
                <label><span style={label}>CATEGORY</span>
                  <select value={editing.form.category} onChange={(e) => setField("category", e.target.value)} style={inputStyle}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label><span style={label}>BRAND</span><input value={editing.form.brand} onChange={(e) => setField("brand", e.target.value)} style={inputStyle} /></label>
                <label><span style={label}>PRICE (PKR)</span><input value={editing.form.price} onChange={(e) => setField("price", e.target.value)} inputMode="numeric" style={inputStyle} /></label>
                <label><span style={label}>OLD PRICE (optional)</span><input value={editing.form.oldPrice} onChange={(e) => setField("oldPrice", e.target.value)} inputMode="numeric" style={inputStyle} /></label>
                <label><span style={label}>STOCK</span><input value={editing.form.stock} onChange={(e) => setField("stock", e.target.value)} inputMode="numeric" style={inputStyle} /></label>
                <label><span style={label}>BADGE</span><input value={editing.form.badge} onChange={(e) => setField("badge", e.target.value)} placeholder="e.g. -15%, NEW, HOT" style={inputStyle} /></label>
                <label><span style={label}>RATING (0–5)</span><input value={editing.form.rating} onChange={(e) => setField("rating", e.target.value)} inputMode="decimal" style={inputStyle} /></label>
                <label><span style={label}>REVIEWS</span><input value={editing.form.reviews} onChange={(e) => setField("reviews", e.target.value)} inputMode="numeric" style={inputStyle} /></label>
                <div style={{ gridColumn: "span 2" }}>
                  <span style={label}>IMAGES (first is the main photo — blank list uses a category tile)</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                    {editing.images.map((url, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 36, height: 36, flex: "none", borderRadius: 6, background: url ? `url("${url}") center/cover, #f6f5f1` : "#f6f5f1", border: i === 0 ? "2px solid #ff6a1a" : "1px solid #e6e4dd" }} />
                        <input value={url} onChange={(e) => setImage(i, e.target.value)} placeholder={`https://…  ${i === 0 ? "(primary)" : ""}`} style={{ ...inputStyle, marginTop: 0 }} />
                        <button type="button" onClick={() => removeImage(i)} className="remove-x" style={{ color: "#c9c5bc", fontSize: 16, padding: "0 6px" }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={addImage} style={{ alignSelf: "flex-start", fontSize: 12.5, fontWeight: 700, color: "#ff6a1a", padding: "4px 0" }}>+ Add image</button>
                  </div>
                </div>
                <label style={{ gridColumn: "span 2" }}><span style={label}>DESCRIPTION</span><textarea value={editing.form.description} onChange={(e) => setField("description", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} /></label>
                <label style={{ gridColumn: "span 2" }}><span style={label}>SPECS (key: value | key: value)</span><textarea value={editing.form.specs} onChange={(e) => setField("specs", e.target.value)} rows={2} placeholder="CPU: i9 | RAM: 16GB" style={{ ...inputStyle, resize: "vertical" }} /></label>
              </div>
              {error && <div style={{ color: "#cc3344", fontSize: 12.5, fontWeight: 700, marginTop: 12 }}>{error}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                <button onClick={() => setEditing(null)} disabled={saving} style={{ color: "#8a8a8f", fontWeight: 700, fontSize: 13.5, padding: "11px 16px" }}>Cancel</button>
                <button onClick={save} disabled={saving} style={{ background: saving ? "#d8d6cf" : "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13.5, padding: "11px 22px", borderRadius: 6, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving…" : editing.id ? "Save changes" : "Add product"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* import-from-sheet modal */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !importing && setShowImport(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(20,20,24,0.5)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 20px", overflowY: "auto" }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 540, padding: 24 }}
            >
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 18, marginBottom: 6 }}>Import from Google Sheet</div>
              <div style={{ fontSize: 12.5, color: "#8a8a8f", marginBottom: 16 }}>
                Paste your <b>published-to-web CSV</b> link. Columns: id, name, category, brand, price, oldPrice, stock, rating, reviews, badge, image(s), description, specs.
              </div>

              <label style={{ display: "block" }}>
                <span style={label}>SHEET CSV URL</span>
                <input value={importUrl} onChange={(e) => setImportUrl(e.target.value)} placeholder="https://docs.google.com/.../pub?output=csv" style={inputStyle} />
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                {([
                  ["merge", "Add & update", "Updates products that share an id, adds new ones, keeps the rest."],
                  ["replace", "Replace catalog", "Deletes everything and imports only the sheet's rows."],
                ] as const).map(([val, title, desc]) => {
                  const active = importMode === val;
                  return (
                    <div key={val} onClick={() => setImportMode(val)} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "11px 13px", border: `2px solid ${active ? "#ff6a1a" : "#eceae4"}`, borderRadius: 8, cursor: "pointer", background: active ? "#fff8f3" : "#fff" }}>
                      <div style={{ width: 18, height: 18, marginTop: 1, flex: "none", borderRadius: "50%", border: `2px solid ${active ? "#ff6a1a" : "#cfcdc6"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: active ? "#ff6a1a" : "transparent" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: "#1c1d21" }}>{title}{val === "replace" && <span style={{ color: "#cc3344", fontWeight: 700 }}> ⚠</span>}</div>
                        <div style={{ fontSize: 12, color: "#8a8a8f", marginTop: 2 }}>{desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {importMsg && (
                <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: importMsg.ok ? "#1f8a4c" : "#cc3344" }}>
                  {importMsg.ok ? "✓ " : ""}{importMsg.text}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                <button onClick={() => setShowImport(false)} disabled={importing} style={{ color: "#8a8a8f", fontWeight: 700, fontSize: 13.5, padding: "11px 16px" }}>Close</button>
                <button onClick={runImport} disabled={importing || !importUrl.trim()} style={{ background: importing || !importUrl.trim() ? "#d8d6cf" : "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13.5, padding: "11px 22px", borderRadius: 6, cursor: importing || !importUrl.trim() ? "not-allowed" : "pointer" }}>{importing ? "Importing…" : "Import"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
