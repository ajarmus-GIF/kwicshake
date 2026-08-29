/**
 * One hand-drawn stroke icon per entry in `services` (src/lib/services.ts), in the same order —
 * kept here rather than in that data file since JSX doesn't belong in a plain content module.
 * Shared between /services and the home page's services teaser so the same mark represents the
 * same discipline everywhere it shows up.
 *
 * The two arrays are zipped BY INDEX with nothing keying them together, so adding a service
 * without adding its icon here silently renders an empty <svg>. Keep them the same length.
 *
 * Everything must be a shape DrawSVGPlugin can measure — circle, line, rect, polygon, path.
 * No <text>, no fills, no <g> transforms: ServiceIcon selects those five tags directly and
 * draws each one's stroke, so anything else is invisible on entry and never drawn in.
 */
export const serviceIcons = [
  // Web Design — a browser frame with its chrome dots and a cursor mid-click.
  <>
    <rect key="frame" x="10" y="20" width="80" height="62" rx="6" />
    <line key="chrome" x1="10" y1="38" x2="90" y2="38" />
    <circle key="dot1" cx="20" cy="29" r="2.2" />
    <circle key="dot2" cx="29" cy="29" r="2.2" />
    <circle key="dot3" cx="38" cy="29" r="2.2" />
    <path key="cursor" d="M52 50 L52 76 L59 69 L65 80 L70 77 L64 66 L73 66 Z" strokeLinejoin="round" />
  </>,
  // Social Media Consultations — three connected nodes, a small conversation network.
  <>
    <circle key="n1" cx="30" cy="72" r="8" />
    <circle key="n2" cx="70" cy="72" r="8" />
    <circle key="n3" cx="50" cy="26" r="8" />
    <line key="e1" x1="36" y1="66" x2="45" y2="33" />
    <line key="e2" x1="64" y1="66" x2="55" y2="33" />
    <line key="e3" x1="38" y1="72" x2="62" y2="72" />
  </>,
  // Digital Brand Consulting — a compass mark: outer diamond, inner diamond, cardinal ticks.
  <>
    <polygon key="outer" points="50,8 90,50 50,92 10,50" />
    <polygon key="inner" points="50,28 72,50 50,72 28,50" />
    <line key="tick-n" x1="50" y1="8" x2="50" y2="20" />
    <line key="tick-s" x1="50" y1="80" x2="50" y2="92" />
    <line key="tick-w" x1="10" y1="50" x2="22" y2="50" />
    <line key="tick-e" x1="78" y1="50" x2="90" y2="50" />
  </>,
  // Digital Ad Consultation — a megaphone with two broadcast arcs.
  <>
    <path key="horn" d="M16 42 L54 22 L54 78 L16 58 Z" strokeLinejoin="round" />
    <line key="handle" x1="28" y1="58" x2="33" y2="80" />
    <path key="wave-near" d="M64 38 A16 16 0 0 1 64 62" />
    <path key="wave-far" d="M74 28 A28 28 0 0 1 74 72" />
  </>,
  // Real-World Applications — a QR code: three finder squares plus a scatter of data modules.
  <>
    <rect key="find-tl" x="12" y="12" width="26" height="26" rx="2" />
    <rect key="find-tl-in" x="20" y="20" width="10" height="10" />
    <rect key="find-tr" x="62" y="12" width="26" height="26" rx="2" />
    <rect key="find-tr-in" x="70" y="20" width="10" height="10" />
    <rect key="find-bl" x="12" y="62" width="26" height="26" rx="2" />
    <rect key="find-bl-in" x="20" y="70" width="10" height="10" />
    <rect key="mod-1" x="50" y="50" width="12" height="12" />
    <rect key="mod-2" x="70" y="58" width="10" height="10" />
    <rect key="mod-3" x="56" y="74" width="10" height="10" />
  </>,
  // Search Engine Optimization — a magnifier with a rising trend line inside the lens.
  <>
    <circle key="lens" cx="43" cy="43" r="27" />
    <line key="handle" x1="62" y1="62" x2="86" y2="86" />
    <path key="trend" d="M30 52 L39 41 L47 48 L58 32" />
    <path key="trend-tip" d="M50 32 L58 32 L58 40" strokeLinejoin="round" />
  </>,
];
