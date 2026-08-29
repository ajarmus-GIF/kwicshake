export interface Service {
  number: string;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
}

/**
 * The service lines the studio actually sells, framed as one connected discipline (internet
 * marketing) rather than a list of separate line items — see /services for how that connective
 * tissue shows up visually (alternating layout, shared icon language).
 *
 * Order is the funnel, not importance: 01-03 build the thing people find (site, social, brand),
 * 04-06 are how they find it (paid, physical, organic). Reordering breaks that reading, and the
 * `number` field is written out rather than derived from the index so a reorder has to be
 * deliberate.
 *
 * Adding an entry here means adding its icon at the SAME INDEX in
 * components/services/serviceIcons.tsx — the two arrays are zipped by position, with no key
 * tying them together.
 */
export const services: Service[] = [
  {
    number: "01",
    kicker: "Presence",
    title: "Web Design",
    description:
      "Your website is the first handshake, the last impression, and the hardest-working salesperson you'll never pay commission. We design and build sites that load fast, read clearly, and turn five seconds of attention into an actual decision to stay.",
    bullets: ["Custom Interface Design", "Responsive Development", "Conversion-First UX", "Performance & SEO Foundations"],
  },
  {
    number: "02",
    kicker: "Conversation",
    title: "Social Media Consultations",
    description:
      "Algorithms change weekly. Attention spans keep shrinking. We sit inside your business, learn what actually makes it tick, and turn that into a social strategy built for how people scroll today — not how they scrolled two years ago.",
    bullets: ["Platform Strategy", "Content Direction", "Voice & Tone Development", "Performance Reviews"],
  },
  {
    number: "03",
    kicker: "Identity",
    title: "Digital Brand Consulting",
    description:
      "A brand isn't a logo — it's the feeling someone can't quite name but instantly recognizes. We dig past the surface to find that feeling, then make sure every touchpoint, from your homepage to your Instagram bio, says the same thing without saying it the same way.",
    bullets: ["Positioning & Messaging", "Visual Identity Systems", "Brand Voice", "Digital Experience Audits"],
  },
  {
    number: "04",
    kicker: "Reach",
    title: "Digital Ad Consultation",
    description:
      "Ad spend is the fastest way to find out whether your message works, or the fastest way to set money on fire. We plan the campaigns, shape the angles, and read the numbers with you — so every dollar buys either a customer or a lesson worth having.",
    bullets: ["Campaign Strategy", "Audience & Targeting", "Ad Creative Direction", "Spend & Performance Reviews"],
  },
  {
    number: "05",
    kicker: "Crossover",
    title: "Real-World Applications",
    description:
      "Your best marketing sometimes sits on a shelf, a van door, or the back of a card someone actually kept. We put your website where your customers already are — QR codes on products and packaging, print and signage worth scanning — so the physical side of your business quietly feeds the digital one.",
    bullets: ["QR Code Campaigns", "Packaging & Product", "Signage & Print", "Offline-to-Online Tracking"],
  },
  {
    number: "06",
    kicker: "Discovery",
    title: "Search Engine Optimization",
    description:
      "The people most likely to buy from you are already typing what you sell into a search bar. SEO is just making sure the answer they get is you. We handle the research, the on-page work, and the technical cleanup that decides whether you show up at all.",
    bullets: ["Keyword & Intent Research", "On-Page Optimization", "Local & Maps SEO", "Technical Audits"],
  },
];

export interface GrowthStage {
  number: string;
  /** What is happening to the customer at this depth — the funnel band's own name. */
  stage: string;
  /** The studio pillar doing the work. These are the four values this section used to list
   *  flat and unexplained; the funnel is what gives each one a job. */
  value: string;
  detail: string;
}

/**
 * The four bands of GrowthFunnel, top to bottom — wide attention narrowing to paying
 * customers. Deliberately the LAST thing on /services: it only lands once a reader has seen
 * all six service lines, because its whole argument is that those six are one machine rather
 * than a menu. Each `detail` names the services that do that band's work, so the section reads
 * as a summary of the page above it rather than as four new claims.
 *
 * Qualitative on purpose — no percentages, no invented conversion rates. The section sells the
 * shape of the process, and a fabricated number is the fastest way to make it untrustworthy.
 */
export const growthStages: GrowthStage[] = [
  {
    number: "01",
    stage: "Attention",
    value: "Built To Be Noticed",
    detail:
      "Paid ads, search, and a QR code on the product itself. We put you in front of the people already looking for what you sell.",
  },
  {
    number: "02",
    stage: "Interest",
    value: "Brand-First Execution",
    detail:
      "The site and the brand take it from there — five seconds of attention turned into a reason to keep reading.",
  },
  {
    number: "03",
    stage: "Trust",
    value: "Full-Funnel Thinking",
    detail:
      "Social that sounds like you instead of an algorithm, saying the same thing your homepage does, in the same voice.",
  },
  {
    number: "04",
    stage: "Customers",
    value: "Always-On Strategy",
    detail:
      "Then we read the numbers and adjust. Every month, more of what goes in the top comes out the bottom.",
  },
];
