import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangSelect from "./components/LangSelect";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddCrop from "./pages/farmer/AddCrop";
import MyCrops from "./pages/farmer/MyCrops";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import Dashboard from "./pages/farmer/Dashboard";
import Market from "./pages/shop/Market";
import ShopOrders from "./pages/shop/ShopOrders";
import Jobs from "./pages/transport/Jobs";

function Shell({ role }) {
  const { t } = useTranslation();
  const name = localStorage.getItem("name");
  const cls = ({ isActive }) => (isActive ? "on" : "");
  const logout = () => {
    ["token", "role", "name"].forEach((k) => localStorage.removeItem(k));
    window.location.href = "/";
  };

  return (
    <>
      <nav>
        <NavLink to="/" end className="brand">🌾 Farmer 360</NavLink>
        <NavLink to="/" end className={cls}>🏠 {t("home")}</NavLink>
        {role === "FARMER" && (<>
          <NavLink to="/farmer/add" className={cls}>🌾 {t("addCrop")}</NavLink>
          <NavLink to="/farmer/crops" className={cls}>🧺 {t("myCrops")}</NavLink>
          <NavLink to="/farmer/orders" className={cls}>📦 {t("myOrders")}</NavLink>
          <NavLink to="/farmer/dashboard" className={cls}>💰 {t("dashboard")}</NavLink>
        </>)}
        {role === "SHOPKEEPER" && (<>
          <NavLink to="/shop" className={cls}>🛒 {t("market")}</NavLink>
          <NavLink to="/shop/orders" className={cls}>📦 {t("myPurchases")}</NavLink>
        </>)}
        {role === "TRANSPORTER" && <NavLink to="/transport" className={cls}>🚚 {t("jobs")}</NavLink>}
        <span className="spacer" />
        <span className="who">👤 {name}</span>
        <LangSelect />
        <button className="out" onClick={logout} title={t("logout")}>⎋ {t("logout")}</button>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {role === "FARMER" && (<>
            <Route path="/farmer/add" element={<AddCrop />} />
            <Route path="/farmer/crops" element={<MyCrops />} />
            <Route path="/farmer/orders" element={<FarmerOrders />} />
            <Route path="/farmer/dashboard" element={<Dashboard />} />
          </>)}
          {role === "SHOPKEEPER" && (<>
            <Route path="/shop" element={<Market />} />
            <Route path="/shop/orders" element={<ShopOrders />} />
          </>)}
          {role === "TRANSPORTER" && <Route path="/transport" element={<Jobs />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return (
    <BrowserRouter>
      {token ? (
        <Shell role={role} />
      ) : (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}