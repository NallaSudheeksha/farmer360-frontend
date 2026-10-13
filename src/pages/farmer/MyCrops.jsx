import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api, { BASE } from "../../api";

export default function MyCrops() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState("");
  const load = () => api.get("/crops/mine").then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const remove = async (c) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try { await api.delete(`/crops/${c.id}`); load(); }
    catch (e) { setMsg(e.response?.data?.message || t("failed")); }
  };

  const save = async () => {
    try {
      await api.put(`/crops/${edit.id}`, { quantityKg: Number(edit.quantityKg), pricePerKg: Number(edit.pricePerKg) });
      setEdit(null); setMsg(""); load();
    } catch (e) { setMsg(e.response?.data?.message || t("failed")); }
  };

  return (
    <>
      <h2>🧺 {t("myCrops")}</h2>
      {msg && <p className="bad">{msg}</p>}
      {list.length === 0 && <p>{t("noItems")}</p>}
      <div className="grid">
        {list.map((c) => (
          <div className="card" key={c.id}>
            {c.imageUrl && <img className="thumb" src={BASE + c.imageUrl} alt={c.name} />}
            <h3>{c.name} {c.quantityKg <= 0 && <span className="chip">{t("soldOut")}</span>}</h3>
            {edit?.id === c.id ? (<>
              <label>{t("quantity")}<input type="number" value={edit.quantityKg} onChange={(e) => setEdit({ ...edit, quantityKg: e.target.value })} /></label>
              <label>{t("price")}<input type="number" value={edit.pricePerKg} onChange={(e) => setEdit({ ...edit, pricePerKg: e.target.value })} /></label>
              <div className="actions">
                <button className="ok" onClick={save}>{t("update")}</button>
                <button className="ghostbtn" onClick={() => setEdit(null)}>{t("cancel")}</button>
              </div>
            </>) : (<>
              <p>₹{c.pricePerKg}/{t("kg")} · {c.quantityKg} {t("kg")}</p>
              <p>📍 {c.pickupLocation}</p>
              <div className="actions">
                <button onClick={() => setEdit({ id: c.id, quantityKg: c.quantityKg, pricePerKg: c.pricePerKg })}>✏️ {t("edit")}</button>
                <button className="no" onClick={() => remove(c)}>🗑️ {t("remove")}</button>
              </div>
            </>)}
          </div>
        ))}
      </div>
    </>
  );
}