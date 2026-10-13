import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";
import OrderCard from "../../components/OrderCard";

const NEXT = { ASSIGNED: "PICKED_UP", PICKED_UP: "IN_TRANSIT", IN_TRANSIT: "DELIVERED" };

export default function Jobs() {
  const { t } = useTranslation();
  const [avail, setAvail] = useState([]);
  const [mine, setMine] = useState([]);
  const load = async () => {
    setAvail((await api.get("/orders/transport/available")).data);
    setMine((await api.get("/orders/transport/mine")).data);
  };
  useEffect(() => { load(); const id = setInterval(load, 10000); return () => clearInterval(id); }, []);

  const claim = async (id) => { await api.put(`/orders/${id}/claim`); load(); };
  const update = async (id, s) => { await api.put(`/orders/${id}/status?status=${s}`); load(); };

  return (
    <>
      <h2>🚚 {t("newPickups")}</h2>
      {avail.map((o) => <OrderCard key={o.id} o={o}><button onClick={() => claim(o.id)}>{t("takeJob")}</button></OrderCard>)}
      <h2>{t("myDeliveries")}</h2>
      {mine.map((o) => (
        <OrderCard key={o.id} o={o}>
          {NEXT[o.status] && <button onClick={() => update(o.id, NEXT[o.status])}>{t("markAs", { status: t("status." + NEXT[o.status]) })}</button>}
        </OrderCard>
      ))}
    </>
  );
}