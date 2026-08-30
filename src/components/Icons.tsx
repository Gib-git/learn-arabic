// Minimal stroke icon set (Lucide-style), 24x24, inherits currentColor.
const paths: Record<string, JSX.Element> = {
  home: (
    <>
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  learn: (
    <>
      <path d="M2 4.5h6.5A3.5 3.5 0 0 1 12 8v13a3 3 0 0 0-3-3H2V4.5Z" />
      <path d="M22 4.5h-6.5A3.5 3.5 0 0 0 12 8v13a3 3 0 0 1 3-3h7V4.5Z" />
    </>
  ),
  review: (
    <>
      <rect x="3" y="7" width="13" height="14" rx="2" />
      <path d="M7.5 7V5a2 2 0 0 1 2-2H19a2 2 0 0 1 2 2v11.5a2 2 0 0 1-2 2h-1.5" />
    </>
  ),
  practice: (
    <>
      <path d="M17 3.5a2.6 2.6 0 0 1 3.7 3.7L7.5 20.4 2.5 21.5l1.1-5L17 3.5Z" />
      <path d="M14.5 6 18 9.5" />
    </>
  ),
  reader: (
    <>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M9.5 7h5" />
    </>
  ),
  roots: (
    <>
      <path d="M12 20v-7" />
      <path d="M12 13c0-4.5 3.2-7.5 8-7.5 0 4.5-3.2 7.5-8 7.5Z" />
      <path d="M12 10.5C12 7 9.5 4.5 5 4.5c0 3.6 2.6 6 7 6" />
      <path d="M6 20h12" />
    </>
  ),
  tutor: (
    <>
      <path d="m22 9.5-10-5-10 5 10 5 10-5Z" />
      <path d="M6 11.8V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.2" />
      <path d="M22 9.5V15" />
    </>
  ),
  stats: (
    <>
      <path d="M3 3v18h18" />
      <path d="M8 17v-5" />
      <path d="M13 17V7" />
      <path d="M18 17v-8" />
    </>
  ),
  glossary: (
    <>
      <path d="M4 7V5h16v2" />
      <path d="M12 5v15" />
      <path d="M9 20h6" />
    </>
  ),
  settings: (
    <>
      <path d="M21 6.5h-7" />
      <path d="M8 6.5H3" />
      <circle cx="11" cy="6.5" r="2.2" />
      <path d="M21 17.5h-5" />
      <path d="M10 17.5H3" />
      <circle cx="13" cy="17.5" r="2.2" />
      <path d="M21 12h-3" />
      <path d="M12 12H3" />
      <circle cx="15" cy="12" r="2.2" />
    </>
  ),
  speaker: (
    <>
      <path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a9 9 0 0 1 0 12" />
    </>
  ),
  speakerOff: (
    <>
      <path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z" />
      <path d="m16 9.5 5 5" />
      <path d="m21 9.5-5 5" />
    </>
  ),
  play: <path d="M7 4.5v15l12-7.5L7 4.5Z" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5L20 6.5" />,
  flame: (
    <path d="M12 21c4 0 6.5-2.4 6.5-6 0-2.5-1.4-4.7-3-6.5-.4 1.2-1.2 2.2-2.3 2.7C13.5 8.6 13 5.5 10 3c.3 2.5-.7 4-2.2 5.6C6.3 10.2 5.5 12.2 5.5 15c0 3.6 2.5 6 6.5 6Z" />
  ),
  sparkle: (
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.5 10.5h7" />
      <path d="M8.5 13.5h4.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 2.8V6" />
      <path d="M16 2.8V6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
};

export function Icon({ name, size = 20 }: { name: keyof typeof paths | string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? null}
    </svg>
  );
}
