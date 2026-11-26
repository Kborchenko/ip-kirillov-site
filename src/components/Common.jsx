import { ArrowDown, ArrowRight, ArrowUpRight, Menu } from "lucide-react";
import { agency, displayName, hasContacts, mail, telephone } from "../config/agency";
import { documents } from "./legalDocuments";
import CategoryList from "./CategoryList";

export function ActionLink({ href, children, primary = false, direction = "right" }) {
  const Icon = { down: ArrowDown, right: ArrowRight, external: ArrowUpRight }[direction];
  return <a className={primary ? "action primary" : "action secondary"} href={href}>{children}<Icon size={17} aria-hidden="true"/></a>;
}

function Navigation({ page, label }) {
  return <nav className="nav-links" aria-label={label}>
    <a href="/about/" aria-current={page === "about" ? "page" : undefined}>Об агентстве</a>
    <a href="/employers/" aria-current={page === "employers" ? "page" : undefined}>Работодателям</a>
    <a href="/#candidates">Соискателям</a><a href="/#contacts">Контакты</a>
  </nav>;
}

function Brand() {
  return <a className="brand" href="/"><svg width="34" height="32" viewBox="0 0 34 32" fill="none" aria-hidden="true"><path d="M2 27C2 13 12 3 26 3M8 28C8 17 16 9 27 9M14 29C14 21 20 15 28 15" stroke="currentColor" strokeWidth="2.2"/><circle cx="28" cy="24" r="3.4" fill="currentColor"/></svg>{displayName}</a>;
}

export function ContactLinks() {
  return <>{telephone && <a href={"tel:"+telephone}>{agency.phone}</a>}{mail && <a href={mail}>{agency.email}</a>}</>;
}
export function Header({ page }) {
  return <header className="site-header"><a className="skip" href="#main">Перейти к содержанию</a>
    {(hasContacts || agency.hours) && <div className="contact-strip"><div className="wrap">{agency.hours && <span>{agency.hours}</span>}<ContactLinks/></div></div>}
    <div className="wrap header-row"><Brand/><div className="wide-nav"><Navigation page={page} label="Основная"/><ActionLink primary href="/employers/#start">Подобрать персонал</ActionLink></div>
      <details className="mobile-nav"><summary><Menu size={18} aria-hidden="true"/>Меню</summary><div><Navigation page={page} label="Мобильное меню"/><ActionLink primary href="/employers/#start">Подобрать персонал</ActionLink></div></details>
    </div></header>;
}
export function Footer({ page }) {
  return <footer className="border-t border-line"><div className="wrap footer-row"><Brand/><Navigation page={page} label="В подвале"/></div>
    <nav className="wrap legal-nav" aria-label="Реквизиты и документы">
      <a href="/#legal">Реквизиты</a>
      {documents.map(doc => <a key={doc.slug} href={`/${doc.slug}/`} aria-current={page === doc.slug ? "page" : undefined}>{doc.link}</a>)}
    </nav></footer>;
}
export function Steps({ id, title, items, children }) {
  return <section className="wrap section-gap" aria-labelledby={id}><h2 id={id} tabIndex={-1}>{title}</h2>
    <CategoryList as="ol" role="list" className={items.length === 4 ? "steps four" : "steps"}>{items.map(([heading, description], index) => <li key={heading}><div className="step-index" aria-hidden="true">{String(index+1).padStart(2,"0")}</div><h3>{heading}</h3><p>{description}</p></li>)}</CategoryList>{children}</section>;
}
