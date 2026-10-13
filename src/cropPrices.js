import i18n from "./i18n";

// APPROXIMATE typical wholesale price ranges in ₹ per kg (sample reference values).
// For a real product, replace this with live data from the government Agmarknet API.
const PRICES = {
  tomato: [15, 40], "టమాటా": [15, 40], "टमाटर": [15, 40],
  onion: [15, 35], "ఉల్లిపాయ": [15, 35], "प्याज": [15, 35],
  potato: [15, 30], "బంగాళదుంప": [15, 30], "आलू": [15, 30],
  rice: [35, 60], "బియ్యం": [35, 60], "चावल": [35, 60],
  wheat: [22, 35], "గోధుమ": [22, 35], "गेहूं": [22, 35],
  maize: [18, 28], corn: [18, 28],
  groundnut: [50, 80], peanut: [50, 80],
  chilli: [100, 200], chili: [100, 200],
  turmeric: [80, 150],
  banana: [20, 40],
  mango: [40, 100],
  brinjal: [20, 40], carrot: [25, 50], cabbage: [10, 25],
};

export const typicalPrice = (name) => {
  const n = (name || "").trim().toLowerCase();
  if (n.length < 2) return null;
  const key = Object.keys(PRICES).find((k) => n.includes(k));
  return key ? PRICES[key] : null;
};

i18n.addResourceBundle("en", "translation", { typicalPrice: "Typical price: ₹{{min}}–₹{{max}} per kg" }, true, true);
i18n.addResourceBundle("te", "translation", { typicalPrice: "సాధారణ ధర: కిలో ₹{{min}}–₹{{max}}" }, true, true);
i18n.addResourceBundle("hi", "translation", { typicalPrice: "सामान्य भाव: ₹{{min}}–₹{{max}} प्रति किलो" }, true, true);
i18n.addResourceBundle("ta", "translation", { typicalPrice: "வழக்கமான விலை: கிலோ ₹{{min}}–₹{{max}}" }, true, true);
i18n.addResourceBundle("kn", "translation", { typicalPrice: "ಸಾಮಾನ್ಯ ಬೆಲೆ: ಕೆಜಿಗೆ ₹{{min}}–₹{{max}}" }, true, true);
i18n.addResourceBundle("mr", "translation", { typicalPrice: "सामान्य भाव: ₹{{min}}–₹{{max}} प्रति किलो" }, true, true);