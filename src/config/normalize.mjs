const clean = value => typeof value === "string" ? value.trim() : "";
function coordinate(value, limit) {
  if (typeof value !== "number" && !/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(clean(value))) return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : null;
}

function endpoint(value) {
  if (!value || /[\s\\?#]/.test(value) || value.startsWith("//")) return "";
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
  } catch { return ""; }
}

export function normalize(settings = {}) {
  const keys = "agencyName legalName inn ogrnip legalAddress email phone hhVacanciesUrl hours receptionAddress formEndpoint consentText consentVersion".split(" ");
  const agency = Object.fromEntries(keys.map(key => [key, clean(settings[key])]));
  const latitude = coordinate(settings.latitude, 90);
  const longitude = coordinate(settings.longitude, 180);
  const place = agency.receptionAddress && latitude !== null && longitude !== null ? { latitude, longitude } : null;
  const formEndpoint = agency.consentText && agency.consentVersion ? endpoint(agency.formEndpoint) : "";
  return { agency, place, formEndpoint };
}
