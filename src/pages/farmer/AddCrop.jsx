import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { speak, listen } from "../../voice";
import { typicalPrice } from "../../cropPrices";

const FIELDS = [
  { key: "name", label: "cropName" },
  { key: "quantityKg", label: "quantity", num: true },
  { key: "pricePerKg", label: "price", num: true },
  { key: "pickupLocation", label: "location" },
];
const EMPTY = { name: "", quantityKg: "", pricePerKg: "", pickupLocation: "" };

export default function AddCrop() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("");
  const [hint, setHint] = useState(null);
  const stop = useRef(false);

  // price hint from other farmers' listings of the same crop
  useEffect(() => {
    const n = form.name.trim();
    if (n.length < 2) { setHint(null); return; }
    const id = setTimeout(() => {
      api.get("/crops/price-suggestion", { params: { name: n } })
        .then((r) => setHint(r.data))
        .catch(() => setHint(null));
    }, 500);
    return () => clearTimeout(id);
  }, [form.name]);

  const pickImage = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const onChange = (f) => (e) => {
    const v = f.num ? e.target.value.replace(/[^0-9.]/g, "") : e.target.value;
    setForm({ ...form, [f.key]: v });
  };

  const guide = async () => {
    stop.current = false;
    for (const f of FIELDS) {
      if (stop.current) break;
      setActive(f.key);
      setStatus("🔊 " + t(f.label));
      await speak(t(f.label), i18n.language);
      if (stop.current) break;
      setStatus("🎤 " + t(f.label));
      const ans = await listen(i18n.language);
      if (ans) {
        const val = f.num ? (ans.match(/\d+(\.\d+)?/) || [""])[0] : ans;
        setForm((p) => ({ ...p, [f.key]: val }));
      }
    }
    setActive("");
    if (!stop.current) {
      setStatus("📷 " + t("photo"));
      await speak(t("photo"), i18n.language);
    }
    setStatus("");
  };

  const stopGuide = () => {
    stop.current = true;
    window.speechSynthesis.cancel();
    setStatus("");
    setActive("");
  };

  const save = async () => {
    const qty = parseFloat(form.quantityKg);
    const price = parseFloat(form.pricePerKg);
    if (!form.name || !form.pickupLocation || !(qty > 0) || !(price > 0)) {
      setMsg(t("error"));
      return;
    }
    const d = new FormData();
    d.append("name", form.name);
    d.append("quantityKg", qty);
    d.append("pricePerKg", price);
    d.append("pickupLocation", form.pickupLocation);
    if (image) d.append("image", image);
    try {
      await api.post("/crops", d);
      setMsg(t("saved"));
      speak(t("saved"), i18n.language);
      setForm(EMPTY);
      setImage(null);
      setPreview("");
    } catch (e) {
      setMsg(`${t("error")} ${e.response?.data?.message || e.response?.status || "Network"}`);
    }
  };

  // price hint: real listings first, then a typical range for common crops, otherwise nothing
  const renderHint = () => {
    if (hint && hint.count > 0) {
      return (
        <small className="hint">
          💡 {t("marketPrice", { avg: hint.average, min: hint.min, max: hint.max, count: hint.count })}
        </small>
      );
    }
    const ref = typicalPrice(form.name);
    return ref ? (
      <small className="hint">💡 {t("typicalPrice", { min: ref[0], max: ref[1] })}</small>
    ) : null;
  };

  return (
    <div className="card">
      <h2>🌾 {t("addCrop")}</h2>
      <button className="big voice" onClick={guide}>🎤 {t("voice")}</button>
      {status && (
        <div className="status">
          <span>{status}</span>
          <button className="no" onClick={stopGuide}>⏹</button>
        </div>
      )}
      {FIELDS.map((f) => (
        <label key={f.key}>{t(f.label)}
          <input
            className={active === f.key ? "active" : ""}
            inputMode={f.num ? "decimal" : "text"}
            value={form[f.key]}
            onFocus={() => speak(t(f.label), i18n.language)}
            onChange={onChange(f)}
          />
          {f.key === "pricePerKg" && renderHint()}
        </label>
      ))}
      <label>📷 <input type="file" accept="image/*" onChange={pickImage} /></label>
      {preview && <img className="thumb" src={preview} alt="preview" />}
      <button className="big" onClick={save}>{t("save")}</button>
      <p>{msg}</p>
    </div>
  );
}