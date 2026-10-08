/**
 * The businesses the home page dresses up — "one device, many worlds".
 *
 * Purple is the Kwic Shake frame; these palettes are the client's world, and they deliberately
 * look nothing like the site around them. That contrast is the sales argument: we don't force a
 * business into our aesthetic, we give it its own.
 *
 * Every entry except Revolt is a fictional business and is labelled on the page as a concept /
 * art-direction study. Never present one of these as client work.
 */
export interface World {
  id: string;
  /** What the visitor picks: the kind of business. */
  industry: string;
  name: string;
  /** True only for real client work. */
  client?: boolean;
  bg: string;
  fg: string;
  accent: string;
  /** Text colour on an accent-filled button. */
  onAccent: string;
  /** Soft panel colour behind the hero "image". */
  panel: string;
  face: "serif" | "sans" | "display" | "mono";
  kicker: string;
  headline: string;
  sub: string;
  cta: string;
  nav: string[];
  /** Three short proof points along the bottom of the page. */
  points: string[];
}

export const worlds: World[] = [
  {
    id: "restaurant",
    industry: "Restaurant",
    name: "Kaito Omakase",
    bg: "#0b0a09",
    fg: "#f1ebe1",
    accent: "#c9a45c",
    onAccent: "#0b0a09",
    panel: "linear-gradient(160deg, #2a2116 0%, #0b0a09 70%)",
    face: "serif",
    kicker: "Twelve seats · Two seatings",
    headline: "Quiet room. Loud flavour.",
    sub: "A seasonal omakase, prepared in front of you.",
    cta: "Reserve a seat",
    nav: ["Menu", "Chef", "Visit"],
    points: ["18 courses", "Daily fish", "Sake pairing"],
  },
  {
    id: "salon",
    industry: "Salon",
    name: "Blush Studio",
    bg: "#f6dbe4",
    fg: "#2b1320",
    accent: "#c2185b",
    onAccent: "#fff4f8",
    panel: "linear-gradient(160deg, #eab6c8 0%, #f6dbe4 75%)",
    face: "display",
    kicker: "Colour · Cut · Care",
    headline: "Hair that walks in before you do.",
    sub: "Editorial colour and cuts, booked in thirty seconds.",
    cta: "Book a chair",
    nav: ["Services", "Stylists", "Book"],
    points: ["Lived-in colour", "Precision cuts", "Bridal"],
  },
  {
    id: "carpentry",
    industry: "Contractor",
    name: "Northgrain Carpentry",
    bg: "#0f2740",
    fg: "#eaf0f5",
    accent: "#e0a868",
    onAccent: "#0f2740",
    panel: "linear-gradient(160deg, #1d4266 0%, #0f2740 75%)",
    face: "sans",
    kicker: "Custom woodwork · Since 2009",
    headline: "Built once. Built right.",
    sub: "Kitchens, built-ins and staircases made by hand.",
    cta: "Get a quote",
    nav: ["Work", "Process", "Quote"],
    points: ["Solid hardwood", "Fixed quotes", "10-yr warranty"],
  },
  {
    id: "therapy",
    industry: "Therapist",
    name: "Still Water Therapy",
    bg: "#f5e6b8",
    fg: "#3a2d10",
    accent: "#a8641c",
    onAccent: "#fff8e6",
    panel: "linear-gradient(160deg, #f0d27e 0%, #f5e6b8 75%)",
    face: "serif",
    kicker: "Individual & couples",
    headline: "Somewhere to set it down.",
    sub: "Warm, practical therapy, in person or online.",
    cta: "Book a free call",
    nav: ["Approach", "About", "Fees"],
    points: ["Anxiety", "Relationships", "Burnout"],
  },
  {
    id: "accounting",
    industry: "Accountant",
    name: "Ledgerwell CPA",
    bg: "#4a0f1b",
    fg: "#f6ece7",
    accent: "#f0c3ad",
    onAccent: "#4a0f1b",
    panel: "linear-gradient(160deg, #6d1a2a 0%, #4a0f1b 75%)",
    face: "serif",
    kicker: "Tax · Advisory · Bookkeeping",
    headline: "Numbers you can sleep on.",
    sub: "Small-business accounting with a person who picks up.",
    cta: "Schedule a consultation",
    nav: ["Services", "Team", "Contact"],
    points: ["Flat monthly fee", "Same-day replies", "Audit support"],
  },
  {
    id: "outdoor",
    industry: "Outdoor brand",
    name: "Black Creek Outfitters",
    bg: "#373d22",
    fg: "#f1ead6",
    accent: "#f26b1d",
    onAccent: "#1d2010",
    panel: "linear-gradient(160deg, #545c34 0%, #373d22 75%)",
    face: "mono",
    kicker: "Guided trips · Gear",
    headline: "First light. Fish on.",
    sub: "Guided river trips for people who'd rather be out there.",
    cta: "Book a trip",
    nav: ["Trips", "Gear", "Reports"],
    points: ["Licensed guides", "Gear included", "Half & full day"],
  },
  {
    id: "sports",
    industry: "Sports",
    name: "Revolt Lacrosse",
    client: true,
    bg: "#0a0a0a",
    fg: "#ffffff",
    accent: "#f5c400",
    onAccent: "#0a0a0a",
    panel: "linear-gradient(160deg, #262200 0%, #0a0a0a 75%)",
    face: "display",
    kicker: "Club lacrosse · Recruiting",
    headline: "Get seen by the programs that matter.",
    sub: "Development and exposure for players with college goals.",
    cta: "Register",
    nav: ["Teams", "Recruiting", "Register"],
    points: ["College exposure", "Elite coaching", "Showcase events"],
  },
];

export const worldFaces: Record<World["face"], string> = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Arial, sans-serif',
  display: "var(--font-display), sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
};
