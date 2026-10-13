const LANG = { en: "en-IN", te: "te-IN", hi: "hi-IN", ta: "ta-IN", kn: "kn-IN", mr: "mr-IN" };

// load voices early so the first speak() is not delayed
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

const pickVoice = (lang) => {
  const vs = window.speechSynthesis.getVoices();
  return vs.find((v) => v.lang === lang) || vs.find((v) => v.lang.startsWith(lang.split("-")[0]));
};

export const speak = (text, lng) =>
  new Promise((res) => {
    const synth = window.speechSynthesis;
    if (!synth || !text) return res();
    const lang = LANG[lng] || "en-IN";
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const v = pickVoice(lang);
    if (v) u.voice = v;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      res();
    };
    // Chrome sometimes never fires onend, so never wait longer than this
    const timer = setTimeout(finish, Math.max(2500, text.length * 150));
    u.onend = finish;
    u.onerror = finish;
    synth.cancel();
    synth.speak(u);
  });

export const listen = (lng, maxMs = 7000) =>
  new Promise((res) => {
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) return res("");
    const r = new R();
    r.lang = LANG[lng] || "en-IN";
    r.interimResults = false;
    r.maxAlternatives = 1;

    let text = "";
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { r.abort(); } catch {}
      res(text);
    };
    const timer = setTimeout(() => { try { r.stop(); } catch {} setTimeout(finish, 600); }, maxMs);

    r.onresult = (e) => { text = e.results[0][0].transcript; finish(); };
    r.onspeechend = () => { try { r.stop(); } catch {} };
    r.onerror = finish;
    r.onend = finish;
    try { r.start(); } catch { finish(); }
  });