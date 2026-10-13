import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";
import OrderCard from "../../components/OrderCard";
import { speak } from "../../voice";

export default function FarmerOrders() {
  const { t, i18n } = useTranslation();
  const [list, setList] = useState([]);
  const load = () => api.get("/orders/farmer").then((r) => setList(r.data));
  useEffect(() => { load(); const id = setInterval(load, 10000); return () => clearInterval(id); }, []);

  const act = async (id, a) => { await api.put(`/orders/${id}/${a}`); load(); };

  return (
    <>
      <h2>📦 {t("myOrders")}</h2>
      {list.map((o) => (
        <OrderCard key={o.id} o={o}>
          <button onClick={() => speak(t("orderSpeech", { shop: o.shopName, crop: o.cropName, qty: o.quantityKg, amount: o.totalAmount }), i18n.language)}>🔊</button>
          {o.status === "PLACED" && (<>
            <button className="ok" onClick={() => act(o.id, "accept")}>✅ {t("accept")}</button>
            <button className="no" onClick={() => act(o.id, "reject")}>❌ {t("reject")}</button>
          </>)}
        </OrderCard>
      ))}
    </>
  );
}