import settings from "@agency-settings";
import publicSettings from "./agency.json";
import { normalize } from "./normalize.mjs";

export const { agency, place, formEndpoint } = normalize({ ...publicSettings, ...settings });
export const isDemo = settings.demo === true;
export const displayName = agency.agencyName || "Кадровое агентство";
export const telephone = /^[+\d][\d\s()\-]{5,30}$/.test(agency.phone) ? agency.phone.replace(/[^\d+]/g, "") : "";
export const mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agency.email) ? "mailto:" + encodeURIComponent(agency.email).replace("%40", "@") : "";
export const hasContacts = Boolean(mail || telephone);
export const hasLegal = Boolean(agency.legalName || agency.inn || agency.ogrnip || agency.legalAddress);
function employerProfile(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /(^|\.)hh\.ru$/.test(url.hostname) && !url.username && !url.password && !url.port && /^\/employer\/\d+(?:\/|$)/.test(url.pathname) ? url.href : "";
  } catch { return ""; }
}
export const vacancies = employerProfile(agency.hhVacanciesUrl);
