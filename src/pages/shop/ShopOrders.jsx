import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";
import OrderCard from "../../components/OrderCard";

export default function ShopOrders() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  useEffect(() => {
    const load = () => api.get("/orders/shop").then((r) => setList(r.data));
    load(); const id = setInterval(load, 10000); return () => clearInterval(id);
  }, []);
  return (<><h2>📦 {t("myPurchases")}</h2>{list.map((o) => <OrderCard key={o.id} o={o} />)}</>);
}