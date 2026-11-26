import { ServiceMark } from "./IndexArtwork";

export default function ServiceCard({ id, kind, title, description, children }) {
  return <article className="service" id={id} tabIndex={id ? -1 : undefined}>
    <div className="service-intro">
      <ServiceMark kind={kind} stamp/>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <p className="service-result">{children}</p>
  </article>;
}
