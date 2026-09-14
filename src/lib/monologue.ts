/**
 * The internal-monologue lines: sentences written in the visitor's own voice, not the studio's.
 *
 * These are the site's emotional punctuation. They exist so a business owner reading the page
 * hits a line they have actually said out loud and thinks "they understand exactly what I'm
 * dealing with" — which no amount of describing our services can do.
 *
 * Two rules govern them, and both are about restraint:
 *
 * 1. They are placed, never sprinkled. Each one is claimed by exactly one location on the site
 *    (see the `where` field). A line that shows up twice stops sounding like the reader's own
 *    thought and starts sounding like ad copy, which is the one thing it must not sound like.
 *
 * 2. They never run as a paragraph. They are always set as individual statements — a card, a
 *    pull quote, a band between two conventional sections — with space around them. Stacked
 *    into prose they read as a list of objections being handled, rather than as recognition.
 *
 * `problem-grid` lines are the home page's PROBLEM beat and are shown together as a set. Every
 * other line stands alone on the page named in `where`.
 */
export interface MonologueLine {
  id: string;
  /** The thought, first person, exactly as someone would actually say it. */
  text: string;
  /** The single location on the site that owns this line. Keeps them from being reused. */
  where: "problem-grid" | "services" | "work" | "about" | "contact";
}

export const monologue: MonologueLine[] = [
  {
    id: "website-looks",
    text: "I know we're better than our website makes us look.",
    where: "problem-grid",
  },
  {
    id: "more-people",
    text: "We get good customers. I just wish more people knew about us.",
    where: "problem-grid",
  },
  {
    id: "still-starting",
    text: "Our business has grown, but our brand still looks like we're just getting started.",
    where: "problem-grid",
  },
  {
    id: "where-to-start",
    text: "I don't even know where to start with marketing anymore.",
    where: "problem-grid",
  },
  {
    id: "dont-see-it",
    text: "I know we have something good here. I just don't think people see it.",
    where: "problem-grid",
  },
  {
    id: "another-agency",
    text: "I don't want another agency. I want someone who actually gets it.",
    where: "about",
  },
  {
    id: "internet-sees-it",
    text: "I know the business is good. I'm just not sure the internet sees it.",
    where: "services",
  },
  {
    id: "worth-showing",
    text: "I've got work I'm proud of. I've just never had anywhere good to put it.",
    where: "work",
  },
  {
    id: "putting-it-off",
    text: "I've been meaning to deal with this for about two years now.",
    where: "contact",
  },
];

/** The five lines the home page's PROBLEM section shows as a set. */
export const problemMonologue = monologue.filter((line) => line.where === "problem-grid");

/**
 * The single line belonging to a given page. Returns undefined rather than throwing so a
 * mis-typed key degrades to "no pull quote" instead of a build failure on a marketing page.
 */
export function monologueFor(where: MonologueLine["where"]): MonologueLine | undefined {
  return monologue.find((line) => line.where === where);
}
