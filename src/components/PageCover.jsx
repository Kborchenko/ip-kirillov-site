import { ActionLink } from "./Common";

export default function PageCover({ panelClass, title, accent, children, href, action, image, alt }) {
  return <section className={panelClass + " pattern-panel"}>
    <div className="wrap inner-hero">
      <div className="intro">
        <h1>{title} <span>{accent}</span></h1>
        <p>{children}</p>
        <ActionLink primary href={href} direction="down">{action}</ActionLink>
      </div>
      <img className="brief-art" width="1000" height="750" fetchPriority="high" src={image} alt={alt}/>
    </div>
  </section>;
}
