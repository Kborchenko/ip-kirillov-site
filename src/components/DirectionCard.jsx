const frameMotifs = {
  support: <path d="M22 11v2m5-5v8m5-12v16m5-13v10m5-7v4m5-6v8m5-13v18m5-15v12m5-8v4m5-3v2m5-6v10m5-14v18m5-13v8m5-6v4m5-6v8m5-10v12m5-9v6m5-4v2" />,
  sales: (
    <>
      <path d="M72 12h6" />
      <path className="direction-print" d="M21 3h24v11H31l-6 5v-5h-4z M49 10h20v10h-4v3l-5-3H49z M81 4h27v12H94l-7 5v-5h-6z" />
      <path d="M26 7h14m-14 3h8m20 5h9m23-7h16m-16 4h9" />
    </>
  ),
  retail: (
    <>
      <path className="direction-print" d="M14 12l5-9h94l5 9q0 6-6.5 6t-6.5-6q0 6-6.5 6T92 12q0 6-6.5 6T79 12q0 6-6.5 6T66 12q0 6-6.5 6T53 12q0 6-6.5 6T40 12q0 6-6.5 6T27 12q0 6-6.5 6T14 12Z" />
      <path d="M27 12l4-9m9 9 3-9m10 9 1-9m12 9V3m13 9-1-9m14 9-3-9m16 9-4-9" />
    </>
  ),
  orders: (
    <>
      <path d="M21 9l10-5 10 5v10l-10 5-10-5z M21 9l10 5 10-5m-10 5v10m-6-17 10 5" transform="translate(0 -0.5)" />
      <path strokeDasharray="2 4" d="M45 15h9q5 0 5-5t5-5h7q5 0 5 6t5 6h8" />
      <path className="direction-print" d="M109 9c0 5-7 13-7 13s-7-8-7-13a7 7 0 0 1 14 0Z" />
      <circle cx="102" cy="9" r="2" />
    </>
  ),
  office: (
    <>
      <path d="M26 5h-4v16h21 M56 5h-4v16h21 M86 5h-4v16h21" />
      {[26, 56, 86].map(x => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path className="direction-print" d="M0 2h14l5 5v11H0z" />
          <path d="M14 2v5h5M4 9h7m-7 4h11" />
        </g>
      ))}
    </>
  ),
  warehouse: (
    <>
      <path d="M17 17h98v4H17z M23 21v2m43-2v2m43-2v2" />
      <path className="direction-print" d="M20 17V7h18v10m3 0V7h20v10m4 0V7h20v10m4 0V7h21v10 M32 7V1h18v6m29 0V1h19v6" />
      <path d="M29 8v3m22-3v3m24-3v3m25-3v3M41 2v2m48-2v2" />
    </>
  ),
};

export default function DirectionCard({ id, Icon, title, jobs }) {
  return (
    <li className="direction-card" data-direction={id}>
      <svg className="direction-frame" viewBox="0 0 132 26" width="132" height="26" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" focusable="false">
        {frameMotifs[id]}
      </svg>
      <Icon className="direction-icon" size={22} strokeWidth={1.65} aria-hidden="true" focusable="false" />
      <div>
        <h3>{title}</h3>
        <p>{jobs}</p>
      </div>
    </li>
  );
}
