const drawings = {
  specialist: <>
    <path d="M8 19V10l3-3h17l3 3v6M8 14h11"/>
    <circle cx="24" cy="23" r="7"/><path d="m29 28 5 5M21 23h6"/>
  </>,
  "team-hiring": <>
    <path d="m6 14 2-4 18-3 3 2M8 18l2-4 19-2 3 3M9 19h23v12H9z"/>
    <path d="M13 23h7m-7 4h12"/><circle cx="27.5" cy="22.5" r="1" fill="currentColor" stroke="none"/>
  </>,
  responses: <>
    <path d="M10 8h20v24H10zM15 14h9m-9 5h7m-7 5h4"/>
    <path d="m23 24 3 3 7-8" strokeWidth="2.7"/>
  </>,
  sourcing: <>
    <path d="M6 8h17v13H6zM17 25v7h17V20h-5M10 13h7m-7 4h4"/>
    <path d="M19 26c7-1 10-5 10-12m-4 4 4-5 4 5"/>
  </>,
};
export const serviceIds = Object.keys(drawings);

export function ServiceMark({ kind, stamp = false }) {
  return <span aria-hidden="true" className={stamp ? "service-mark ink-stamp" : "service-mark"}>
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{drawings[kind]}</svg>
  </span>;
}

export function InterviewPhoto() {
  return <img className="interview-photo" src="/images/interview-table.webp" width="1050" height="700" loading="lazy" decoding="async" alt="Собеседники обсуждают документ за рабочим столом"/>;
}
