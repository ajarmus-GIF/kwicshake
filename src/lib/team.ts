export interface TeamBeat {
  headline: string;
  detail: string;
}

export interface TeamMember {
  number: string;
  firstName: string;
  lastName: string;
  role: string;
  /**
   * What this person does for a client, in a paragraph. Written for someone deciding whether
   * to hire us — the client experience — not as a biography. Every claim here is backed by a
   * beat below; nothing is inflated into a credential we don't have.
   */
  intro: string;
  /** The same paragraph compressed to one line. The part people actually remember. */
  inOtherWords: string;
  beats: TeamBeat[];
}

/**
 * The two founders, written as beats rather than bios: each one a short headline with a single
 * supporting line under it. That shape is the whole reason the About page can present sixteen
 * facts without reading like sixteen paragraphs — see TeamMemberFlow, which paces them one at a
 * time against a sticky identity panel.
 *
 * Copy is the client's own, verbatim. Don't smooth it out — the flat, declarative voice ("Started
 * at the sink.") is the joke and the tone at once, and rewriting it into marketing prose kills it.
 */
export const team: TeamMember[] = [
  {
    number: "01",
    firstName: "Jonah",
    lastName: "Jarmus",
    role: "Creative Director",
    intro:
      "Jonah brings the operational side of the business to the creative side. His background is in project management, business operations, leadership, and getting complicated things moving in the same direction. He's the person making sure the big idea actually becomes something real.",
    inOtherWords: "He makes the machine work.",
    beats: [
      {
        headline: "Operations is the home base.",
        detail:
          "Built a background in project management and running the overall operations of companies.",
      },
      {
        headline: "Youngest of three brothers.",
        detail: "Learned early how to hold a position in a room full of strong opinions.",
      },
      {
        headline: "Started at the sink.",
        detail:
          "Humble beginnings as a dishwasher, which is where most people find out what real work ethic looks like.",
      },
      {
        headline: "Indiana Tech graduate.",
        detail: "Degree in Business Management.",
      },
      {
        headline: "Captained a lacrosse team.",
        detail: "Student athlete who led from the front.",
      },
      {
        headline: "Served on the Indiana Tech Lacrosse Leadership Council.",
        detail: "Chosen to shape the program, not just play in it.",
      },
      {
        headline: "Dog owner.",
        detail: "Generally the calmest voice on any call.",
      },
      {
        headline: "Drove a 2015 Jeep Patriot that fell apart one part at a time.",
        detail:
          "Handles adversity extremely well. Nothing a client project throws at him has ever quite matched a Tuesday morning in that Jeep.",
      },
    ],
  },
  {
    number: "02",
    firstName: "Aidan",
    lastName: "Jarmus",
    role: "Lead Digital Marketer",
    intro:
      "Aidan has spent roughly a decade building websites and working on digital experiences. His focus sits where strategy and creativity overlap — figuring out what a business needs to say, how it should look, and how to turn attention into action. He also has a background in entrepreneurship and a passion for creative work outside of client projects.",
    inOtherWords: "He makes people care.",
    beats: [
      {
        headline: "Ten years of website design work.",
        detail: "A decade of building sites that actually do their job.",
      },
      {
        headline: "Oldest of three brothers.",
        detail: "Been setting the pace since the beginning.",
      },
      {
        headline: "Started by mowing lawns and knocking on doors.",
        detail:
          "Same job as today, really. Find the people who need something, show them you will do it right, then do it right.",
      },
      {
        headline: "Went through the entrepreneurship program at Indiana Tech.",
        detail: "Learned how to build a business, not just a service.",
      },
      {
        headline: "Produces EDM as a passion project.",
        detail: "Music is where the creative side gets to run without a client brief.",
      },
      {
        headline: "Believes mental health matters.",
        detail: "Being happy and being yourself is what lets you spread it to everyone around you.",
      },
      {
        headline: "Sailed the Florida Keys as a Sea Scout.",
        detail: "Learned to read conditions and adjust, which turns out to be most of marketing.",
      },
      {
        headline:
          "Once fixed the serpentine belt on a 1995 Chrysler LeBaron with a six iron and a flathead screwdriver.",
        detail:
          "Outside the box thinking, documented. If your marketing problem has an obvious solution, it probably will not be the one he uses.",
      },
    ],
  },
];
