import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";
import { speak } from "../voice";

const TILES = {
  FARMER: [["🌾", "addCrop", "/farmer/add"], ["🧺", "myCrops", "/farmer/crops"], ["📦", "myOrders", "/farmer/orders"], ["💰", "dashboard", "/farmer/dashboard"]],
  SHOPKEEPER: [["🛒", "market", "/shop"], ["📦", "myPurchases", "/shop/orders"]],
  TRANSPORTER: [["🚚", "jobs", "/transport"]],
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "";
  const [stats, setStats] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (role === "FARMER") {
          const d = (await api.get("/dashboard/farmer")).data;
          setStats([["📅", "week", "₹" + d.weeklyEarnings], ["⏳", "pending", d.pendingOrders], ["💰", "totalEarnings", "₹" + d.totalEarnings]]);
        } else if (role === "SHOPKEEPER") {
          setStats([["🥬", "availableCrops", (await api.get("/crops")).data.length]]);
        } else if (role === "TRANSPORTER") {
          setStats([["📦", "newPickups", (await api.get("/orders/transport/available")).data.length]]);
        }
      } catch { setStats([]); }
    })();
  }, [role]);

  return (
    <>
      <div className="welcome">
        <h1>👋 {t("welcome", { name })}</h1>
        <p>{t("whatToday")}</p>
        <button className="big voice" onClick={() => speak(t("speakWelcome", { name }), i18n.language)}>🔊</button>
      </div>

      {stats.length > 0 && (
        <div className="grid">
          {stats.map(([ico, key, val]) => (
            <div className="card stat" key={key}>{ico} {t(key)}<br /><b>{val}</b></div>
          ))}
        </div>
      )}

      <div className="tiles">
        {(TILES[role] || []).map(([ico, key, path]) => (
          <Link key={path} to={path} className="tile">
            <span className="ico">{ico}</span>
            {t(key)}
          </Link>
        ))}
      </div>
    </>
  );
}