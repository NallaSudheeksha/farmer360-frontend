import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api, { BASE } from "../../api";

export default function Market() {
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [qty, setQty] = useState({});
  const [addr, setAddr] = useState("");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const load = () => api.get("/crops").then((r) => setCrops(r.data));
  useEffect(() => { load(); }, []);

  const order = async (c) => {
    try {
      await api.post("/orders", { cropId: c.id, quantityKg: Number(qty[c.id]), deliveryAddress: addr });
      setMsg(t("orderPlaced")); setQty({ ...qty, [c.id]: "" }); load();
    } catch (e) { setMsg(e.response?.data?.message || t("failed")); }
  };

  const shown = crops.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <h2>🛒 {t("availableCrops")}</h2>
      <div className="card">
        <input placeholder={"🔎 " + t("search")} value={q} onChange={(e) => setQ(e.target.value)} />
        <input placeholder={"📍 " + t("deliveryAddress")} value={addr} onChange={(e) => setAddr(e.target.value)} />
        {msg && <p>{msg}</p>}
      </div>
      <div className="grid">
        {shown.map((c) => {
          const n = Number(qty[c.id] || 0);
          return (
            <div className="card" key={c.id}>
              {c.imageUrl && <img className="thumb" src={BASE + c.imageUrl} alt={c.name} />}
              <h3>{c.name}</h3>
              <p>{t("kgLeft", { price: c.pricePerKg, qty: c.quantityKg })}</p>
              <p>👨‍🌾 {c.farmerName} · 📍 {c.pickupLocation}</p>
              <input type="number" min="0" placeholder={t("kg")} value={qty[c.id] || ""}
                     onChange={(e) => setQty({ ...qty, [c.id]: e.target.value })} />
              {n > 0 && <p className="total">{t("total")}: ₹{(n * c.pricePerKg).toFixed(2)}</p>}
              <button disabled={!(n > 0) || !addr.trim()} onClick={() => order(c)}>{t("order")}</button>
            </div>
          );
        })}
      </div>
      {shown.length === 0 && <p>{t("noItems")}</p>}
    </>
  );
}