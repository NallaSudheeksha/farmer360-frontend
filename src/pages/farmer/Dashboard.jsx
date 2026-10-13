import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api";
import { speak } from "../../voice";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/dashboard/farmer").then((r) => setD(r.data)); }, []);
  if (!d) return <p>...</p>;

  const crops = Object.entries(d.cropsSold).map(([name, kg]) => ({ name, kg }));
  return (
    <>
      <h2>💰 {t("dashboard")}</h2>
      <div className="grid">
        <div className="card stat">📅 {t("week")}<br /><b>₹{d.weeklyEarnings}</b></div>
        <div className="card stat">🗓️ {t("month")}<br /><b>₹{d.monthlyEarnings}</b></div>
        <div className="card stat">💰 {t("totalEarnings")}<br /><b>₹{d.totalEarnings}</b></div>
        <div className="card stat">📦 {t("orders")}<br /><b>{d.totalOrders}</b></div>
        <div className="card stat">⏳ {t("pending")}<br /><b>{d.pendingOrders}</b></div>
      </div>
      <button className="big voice" onClick={() => speak(t("earningsSpeech", { week: d.weeklyEarnings, month: d.monthlyEarnings }), i18n.language)}>🔊</button>
      <div className="card">
        <h3>{t("last7days")}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={d.chart}><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#2e7d32" /></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>{t("cropsSold")}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={crops}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="kg" fill="#f9a825" /></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card"><h3>{t("shopkeepers")}</h3>{d.shopkeepers.join(", ") || "-"}</div>
      <div className="card"><h3>{t("deliveryHistory")}</h3>
        {d.history.length === 0 && <p>{t("noItems")}</p>}
        {d.history.map((o) => <p key={o.id}>#{o.id} · {o.cropName} · {o.quantityKg}{t("kg")} · ₹{o.totalAmount} · {o.shopName}</p>)}
      </div>
    </>
  );
}