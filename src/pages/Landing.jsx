import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangSelect from "../components/LangSelect";

const FEATURES = [["🎤", "feat1"], ["🌐", "feat2"], ["💰", "feat3"], ["🚚", "feat4"], ["📍", "feat5"], ["📊", "feat6"]];
const STEPS = ["step1", "step2", "step3", "step4"];
const ROLES = [["👨‍🌾", "farmer", "roleFarmerText"], ["🏪", "shopkeeper", "roleShopText"], ["🚛", "transporter", "roleTransportText"]];

export default function Landing() {
  const { t } = useTranslation();
  return (
    <>
      <nav>
        <span className="brand">🌾 Farmer 360</span>
        <span className="spacer" />
        <LangSelect />
        <Link className="navbtn" to="/login">{t("login")}</Link>
      </nav>
      <main>
        <section className="hero">
          <h1>🌾 Farmer 360</h1>
          <p className="tag">{t("appTagline")}</p>
          <p className="sub">{t("heroSub")}</p>
          <div className="cta">
            <Link className="btn primary" to="/login?mode=register">{t("getStarted")}</Link>
            <Link className="btn ghost" to="/login">{t("login")}</Link>
          </div>
        </section>

        <section className="section">
          <h2>{t("featuresTitle")}</h2>
          <div className="grid3">
            {FEATURES.map(([ico, k]) => (
              <div className="feat" key={k}>
                <div className="ico">{ico}</div>
                <h3>{t(k)}</h3>
                <p>{t(k + "Text")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>{t("howTitle")}</h2>
          <div className="grid4">
            {STEPS.map((k, i) => (
              <div className="feat step" key={k}>
                <div className="num">{i + 1}</div>
                <h3>{t(k)}</h3>
                <p>{t(k + "Text")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>{t("rolesTitle")}</h2>
          <div className="grid3">
            {ROLES.map(([ico, k, txt]) => (
              <div className="feat" key={k}>
                <div className="ico">{ico}</div>
                <h3>{t(k)}</h3>
                <p>{t(txt)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer>{t("footer")}</footer>
    </>
  );
}