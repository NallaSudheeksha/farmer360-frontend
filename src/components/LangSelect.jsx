import { useTranslation } from "react-i18next";

export const LANGS = { en: "English", te: "తెలుగు", hi: "हिन्दी", ta: "தமிழ்", kn: "ಕನ್ನಡ", mr: "मराठी" };

export default function LangSelect() {
  const { i18n } = useTranslation();
  const change = (l) => { i18n.changeLanguage(l); localStorage.setItem("lang", l); };
  return (
    <select value={i18n.language} onChange={(e) => change(e.target.value)} aria-label="Language">
      {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
    </select>
  );
}