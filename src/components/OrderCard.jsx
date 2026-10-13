import { useState } from "react";
import { useTranslation } from "react-i18next";
import api, { BASE } from "../api";

const STEPS = ["PLACED", "ACCEPTED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

export default function OrderCard({ o, children }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const idx = STEPS.indexOf(o.status);

  const toggle = async () => {
    if (!open) {
      try { setEvents((await api.get(`/orders/${o.id}/timeline`)).data); } catch { setEvents([]); }
    }
    setOpen(!open);
  };

  return (
    <div className="card">
      {o.imageUrl && <img src={BASE + o.imageUrl} alt={o.cropName} className="thumb" />}
      <h3>#{o.id} · {o.cropName} — {o.quantityKg} {t("kg")} — ₹{o.totalAmount}</h3>
      <p>{t("farmerLabel")}: {o.farmerName} | {t("shopLabel")}: {o.shopName}</p>
      <p>{t("pickup")}: {o.pickupLocation} → {t("deliverTo")}: {o.deliveryAddress}</p>
      {o.transporterName && <p>{t("transport")}: {o.transporterName}</p>}
      {o.status === "REJECTED" ? <b className="bad">{t("status.REJECTED")}</b> : (
        <div className="track">
          {STEPS.map((s, i) => <span key={s} className={i <= idx ? "done" : ""}>{t("status." + s)}</span>)}
        </div>
      )}
      <div className="actions">
        {children}
        <button className="ghostbtn" onClick={toggle}>📍 {open ? t("hideTrack") : t("track")}</button>
      </div>
      {open && (
        <ul className="timeline">
          {events.map((e, i) => (
            <li key={i}>
              <b>{t("status." + e.status)}</b>
              <small>{new Date(e.time).toLocaleString(i18n.language)}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}