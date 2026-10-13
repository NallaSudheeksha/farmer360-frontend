import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";
import LangSelect from "../components/LangSelect";

export default function Login() {
  const { t, i18n } = useTranslation();
  const [params] = useSearchParams();
  const [reg, setReg] = useState(params.get("mode") === "register");
  const [f, setF] = useState({ name: "", phone: "", password: "", role: "FARMER", address: "" });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [show, setShow] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const errorText = (e) => {
    if (!e.response) return "Cannot reach the server. Is the backend running on port 8080?";
    const d = e.response.data;
    if (typeof d === "string" && d) return d;
    return d?.message || `${t("failed")} (${e.response.status})`;
  };

  const submit = async () => {
    setErr(""); setInfo("");
    try {
      const { data } = await api.post(reg ? "/auth/register" : "/auth/login", { ...f, language: i18n.language });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("lang", i18n.language);
      window.location.href = "/";
    } catch (e) {
      setErr(errorText(e));
    }
  };

  const sendOtp = async () => {
    setErr(""); setInfo("");
    try {
      await api.post("/auth/forgot-password", { phone: f.phone });
      setStep(2);
      setInfo("OTP sent. (Demo: look for it in the Eclipse Console.)");
    } catch (e) {
      setErr(errorText(e));
    }
  };

  const resetPassword = async () => {
    setErr(""); setInfo("");
    try {
      await api.post("/auth/reset-password", { phone: f.phone, otp, newPassword: f.password });
      setForgot(false); setStep(1); setOtp(""); setReg(false);
      setF({ ...f, password: "" });
      setInfo("Password changed. Please login.");
    } catch (e) {
      setErr(errorText(e));
    }
  };

  const phoneInput = (
    <input placeholder={t("phone10")} inputMode="numeric" maxLength={10} value={f.phone}
           onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, "") })}
           disabled={forgot && step === 2} />
  );

  const passwordInput = (placeholder, onEnter) => (
    <div className="pw-wrap">
      <input placeholder={placeholder} type={show ? "text" : "password"}
             value={f.password} onChange={set("password")}
             onKeyDown={(e) => e.key === "Enter" && onEnter && onEnter()} />
      <button type="button" className="eye" onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}>
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );

  if (forgot) {
    return (
      <main>
        <div className="card login">
          <a href="#" className="back" onClick={(e) => { e.preventDefault(); setForgot(false); setStep(1); setErr(""); setInfo(""); }}>
            ← Back to login
          </a>
          <h1>🔑 Reset password</h1>
          {phoneInput}
          {step === 2 && (<>
            <input placeholder="6-digit OTP" inputMode="numeric" maxLength={6} value={otp}
                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
            {passwordInput("New password (min 6)", resetPassword)}
          </>)}
          {info && <p style={{ color: "#2e7d32" }}>{info}</p>}
          {err && <p className="bad">{err}</p>}
          {step === 1
            ? <button className="big" onClick={sendOtp}>Send OTP</button>
            : <button className="big" onClick={resetPassword}>Change password</button>}
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="card login">
        <Link to="/" className="back">{t("backHome")}</Link>
        <h1>🌾 Farmer 360</h1>
        <LangSelect />
        {reg && <input placeholder={t("name")} value={f.name} onChange={set("name")} />}
        {phoneInput}
        {passwordInput(reg ? t("password6") : t("password"), submit)}
        {reg && (<>
          <select value={f.role} onChange={set("role")}>
            <option value="FARMER">👨‍🌾 {t("farmer")}</option>
            <option value="SHOPKEEPER">🏪 {t("shopkeeper")}</option>
            <option value="TRANSPORTER">🚛 {t("transporter")}</option>
          </select>
          <input placeholder={t("address")} value={f.address} onChange={set("address")} />
        </>)}
        {info && <p style={{ color: "#2e7d32" }}>{info}</p>}
        {err && <p className="bad">{err}</p>}
        <button className="big" onClick={submit}>{reg ? t("register") : t("login")}</button>
        {!reg && (
          <a href="#" onClick={(e) => { e.preventDefault(); setForgot(true); setStep(1); setErr(""); setInfo(""); }}>
            Forgot password?
          </a>
        )}
        <a href="#" onClick={(e) => { e.preventDefault(); setReg(!reg); setErr(""); setInfo(""); }}>
          {reg ? t("haveAccount") : t("newUser")}
        </a>
      </div>
    </main>
  );
}