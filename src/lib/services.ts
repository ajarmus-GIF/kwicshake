export interface Service {
  number: string;
  kicker: string;
  title: string;
  /**
   * The provocation. One short declarative that argues with an assumption the reader arrived
   * with ("You don't need to post more."). It is set larger than the body and read first —
   * emotion before explanation, which is the whole ordering principle of this site.
   */
  hook: string;
  /** The explanation, only after the hook has earned it. What we actually do, plainly. */
  description: string;
  /** Optional last word. Present only where a line genuinely lands; most entries don't need one. */
  closer?: string;
  bullets: string[];
}

/**
 * The six disciplines, written transformation-first.
 *
 * The important thing about this file is what it is NOT: a capability list. Each entry opens
 * with a `hook` that names something the reader already believes and pushes back on it, and
 * only then explains the mechanism. Reordering those two fields — or letting `description`
 * grow into the lead — turns the page back into the service catalogue it used to be.
 *
 * Order is the customer's journey, not our priority: 01-03 are what people encounter (site,
 * social, brand), 04-06 are how they arrive (paid, physical, search). `number` is written out
 * rather than derived from the index so a reorder has to be a deliberate edit.
 *
 * Adding an entry here means adding its icon at the SAME INDEX in
 * components/services/serviceIcons.tsx — the two arrays are zipped by position, with no key
 * tying them together.
 *
 * No numbers anywhere in this file. Not "3x more leads", not "40% faster". We have not run the
 * campaigns that would earn those figures, and a fabricated one is the fastest way to make
 * every other honest sentence here unbelievable.
 */
export const services: Service[] = [
  {
    number: "01",
    kicker: "Presence",
    title: "Web Design",
    hook: "Your website should do more than exist.",
    description:
      "It should make someone think: these are the people I want to work with. We design fast, modern, intentional websites that make your business easier to understand and harder to forget.",
    bullets: [
      "Custom Interface Design",
      "Responsive Development",
      "Conversion-Focused UX",
      "Performance",
      "SEO Foundations",
    ],
  },
  {
    number: "02",
    kicker: "Conversation",
    title: "Social Media Strategy",
    hook: "You don't need to post more.",
    description:
      "You need to give people a reason to care. We help turn your business into something people actually want to follow — content direction, platform strategy, voice, and messaging that feels human instead of manufactured.",
    closer: "Because people don't connect with algorithms. They connect with people.",
    bullets: ["Platform Strategy", "Content Direction", "Voice & Tone", "Creative Concepts"],
  },
  {
    number: "03",
    kicker: "Identity",
    title: "Brand Consulting",
    hook: "Your brand is more than your logo.",
    description:
      "It's the feeling people get when they see your name. We help define what you stand for, how you sound, how you look, and what people should feel when they encounter you.",
    bullets: [
      "Positioning",
      "Messaging",
      "Visual Identity",
      "Brand Voice",
      "Digital Experience Audits",
    ],
  },
  {
    number: "04",
    kicker: "Reach",
    title: "Digital Advertising",
    hook: "Don't pay for attention you haven't earned.",
    description:
      "An ad can put you in front of thousands of people. That doesn't mean thousands of people will care. We find the message, audience, and creative angle that deserves the spend — before you start buying impressions.",
    bullets: ["Campaign Strategy", "Audience Targeting", "Creative Direction", "Budget Strategy"],
  },
  {
    number: "05",
    kicker: "Connection",
    title: "Real-World Marketing",
    hook: "Your marketing doesn't stop at the edge of a screen.",
    description:
      "Your customers live in the real world. So should your marketing. We connect the physical side of your business to the digital side, so the whole thing feels like one ecosystem instead of a pile of disconnected pieces.",
    bullets: [
      "QR Campaigns",
      "Apparel",
      "Packaging",
      "Signage",
      "Print",
      "Offline-to-Online Tracking",
    ],
  },
  {
    number: "06",
    kicker: "Discovery",
    title: "Search Engine Optimization",
    hook: "Somebody is already looking for what you do.",
    description:
      "The question is whether they find you. We improve the parts of your website that help search engines understand your business — and help customers find it.",
    closer: "You shouldn't have to be famous to be found.",
    bullets: [
      "Keyword Research",
      "Search Intent",
      "On-Page Optimization",
      "Local SEO",
      "Technical Audits",
    ],
  },
];

export interface SystemLink {
  number: string;
  /** The piece of marketing doing the work — phrased as the reader's, not ours. */
  piece: string;
  /** The single job it does for the piece that follows it. */
  does: string;
}

/**
 * The argument that the six disciplines above are one machine rather than a menu.
 *
 * This is a LOOP, not a funnel, and that is the entire point: the last link sends people back
 * to the first. A funnel bottoms out at "customers" and stops; this says the real-world
 * touchpoints put someone back at the top, which is what makes the whole thing an engine
 * instead of a campaign. Rendering it as a linear ladder throws away the argument — see
 * components/services/ConnectedSystem.tsx, which closes the ring visually.
 *
 * Deliberately the LAST thing on /services. It only lands once a reader has met all six
 * disciplines individually; shown first it is an abstract diagram about nothing.
 */
export const systemLoop: SystemLink[] = [
  { number: "01", piece: "An ad", does: "gets attention." },
  { number: "02", piece: "Your website", does: "earns interest." },
  { number: "03", piece: "Your brand", does: "builds recognition." },
  { number: "04", piece: "Your social", does: "creates familiarity." },
  { number: "05", piece: "Your SEO", does: "captures demand." },
  {
    number: "06",
    piece: "Your real-world marketing",
    does: "sends people back into the system.",
  },
];
