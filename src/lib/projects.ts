/**
 * Case studies, not portfolio entries.
 *
 * The shape below is the argument: a project is a STORY (problem → opportunity → idea → what we
 * built → why → result), not a screenshot with a client name under it. Anyone can show a
 * finished website. The thing worth showing is what changed and why we chose it — that is what
 * says this studio thinks, rather than just executes.
 *
 * ── The honesty rule, which is load-bearing ──────────────────────────────────────────────────
 * `result` is qualitative on purpose, and must stay that way until real figures exist. No
 * traffic numbers, no conversion rates, no follower counts, no "3x" anything. We have not
 * measured those, and one invented number would make every other sentence on this site
 * suspect — including the true ones. `status` exists so a project still being built says so
 * out loud instead of being quietly implied as finished work.
 *
 * The two placeholder entries that used to sit here ("TODO Project Two", "TODO Client B") were
 * removed rather than rewritten. A portfolio padded with invented clients is the exact thing
 * the visitor this site is written for has been burned by before.
 *
 * Adding a project: fill in every narrative field. A case study missing `why` is a gallery item
 * wearing a case study's clothes.
 */

export type ProjectStatus = "in-progress" | "live";

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  role: string;
  status: ProjectStatus;
  /** One line for list and card views. Says what the project IS, not how good it is. */
  summary: string;
  /** The bigger thing the client is actually trying to do. Framing, set above the narrative. */
  mission: string;

  /** THE PROBLEM — what wasn't working. */
  problem: string;
  /** THE OPPORTUNITY — what this business could become. */
  opportunity: string;
  /** THE IDEA — the strategic direction we chose. */
  idea: string;
  /** THE CHANGES — what we actually built. Concrete, checkable items. */
  built: string[];
  /** WHY WE MADE THOSE DECISIONS — the thinking. The section that proves there was any. */
  why: string;
  /** THE RESULT — qualitative until real measurement exists. See the honesty rule above. */
  result: string[];

  tags: string[];

  /**
   * Image slots. Optional, and unfilled until real work exists to put in them: a stock photo
   * standing in for a client's actual website would misrepresent the work — the same reason the
   * invented placeholder projects were deleted rather than rewritten (see the honesty rule
   * above).
   *
   * Until a path is set, EditorialMedia renders its specified-but-empty frame and says what
   * belongs there. Setting a field is the entire change needed — paths are served from /public,
   * and the layouts already reserve the right aspect ratio for each.
   *
   *   cover — 3:2, used in list and card views (home page proof slot, /work index)
   *   hero  — 16:9 full-bleed band at the top of the case study page
   */
  cover?: string;
  hero?: string;

  /**
   * Optional silent clip for the cover slot — the live site moving, rather than a still of it.
   * `cover` is required alongside it: it is the poster, and it is the entire slot for a reader
   * who has asked for reduced motion (see components/media/EditorialMedia.tsx).
   *
   * Worth the bytes only for work whose point is motion. The still is the default; this is the
   * exception, and one exception per site is about right.
   */
  coverVideo?: string;

  /**
   * The line printed under the cover frame. Worth setting whenever the cover is a recording:
   * without it the reader has to work out for themselves whether they are looking at the
   * client's live site or at something we mocked up, and that answer is the reason it's there.
   */
  coverCaption?: string;
}

export const projects: Project[] = [
  {
    slug: "revolt-lacrosse",
    title: "Revolt Lacrosse",
    client: "Revolt Lacrosse",
    year: "2022",
    category: "Youth Sports Program",
    role: "Positioning, Brand & Web",
    status: "in-progress",
    summary:
      "A youth lacrosse program whose real product isn't lacrosse — it's a player's future.",
    mission:
      "Help players become visible to the schools and coaches who could shape their future.",

    problem:
      "Revolt was doing the work. Families knew the coaching was good, players were developing, and the program had something most youth clubs don't — a genuine focus on getting athletes seen by college programs. None of that was legible from the outside. To a parent comparing options, Revolt looked like every other travel club: a schedule, a registration link, and a logo. The most important thing about the program was the thing hardest to find.",
    opportunity:
      "Most youth sports marketing sells the season. Revolt could sell the outcome parents are actually thinking about at 11pm — whether their kid gets recruited. No competing program in the area was speaking to that directly, which meant the honest version of Revolt's story was also the differentiated one.",
    idea:
      "Lead with recruiting visibility, not roster spots. Treat the parent as the reader and the player's future as the product. Every page answers one question before any other: what does my kid get out of this that they can't get somewhere else?",
    built: [
      "Positioning built around recruiting visibility rather than season sign-ups",
      "Messaging written for the parent making the decision, not the player playing the game",
      "A site structure that puts player development and exposure ahead of schedules",
      "A brand presentation that matches the seriousness of the program's actual coaching",
      "Clear, obvious paths to the information families ask for first",
    ],
    why: "A travel sports program competes on trust, and trust comes from specificity. Generic \"elite development\" language is what every club says, so it reads as noise and quietly signals that a program has nothing particular to offer. Naming the actual mission — getting players in front of the people who make recruiting decisions — is both more honest and harder to copy. We also put the parent first throughout, because the player is the athlete but the parent is the one weighing the cost, the drive, and the season.",
    result: [
      "A clear, defensible position no competing local program was claiming",
      "A recruiting message families can repeat accurately to other families",
      "A digital presence that matches the standard of the coaching",
      "Information families actually look for, reachable without a phone call",
    ],

    tags: ["Positioning", "Brand", "Web"],

    // Their hero, running. A still of this page is a picture of a headline; the recording shows
    // the thing the headline sits on top of — footage of their own players — which is the part
    // a parent reads as "this program is real". Cropped to the page: the recording was taken in
    // a browser window, and the tabs and bookmarks bar around it belong to whoever hit record,
    // not to the client's work.
    cover: "/images/revolt-cover.jpg",
    coverVideo: "/video/revolt-home.mp4",
    coverCaption: "Revolt Lacrosse — the live home page, recorded from the browser. Not a mockup.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * The narrative spine, in reading order. Both the case-study page and the Work page's
 * explainer read from this so the promised structure and the rendered structure cannot drift.
 */
export const caseStudyChapters = [
  { key: "problem", label: "The Problem", prompt: "What wasn't working?" },
  { key: "opportunity", label: "The Opportunity", prompt: "What could this business become?" },
  { key: "idea", label: "The Idea", prompt: "What direction did we choose?" },
  { key: "built", label: "The Changes", prompt: "What did we actually build?" },
  { key: "result", label: "The Result", prompt: "What changed?" },
  { key: "why", label: "The Thinking", prompt: "Why we made those decisions." },
] as const;
