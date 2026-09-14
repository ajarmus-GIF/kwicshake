export interface ProcessStep {
  number: string;
  /** One verb. The step's name, and all most readers will take away. */
  label: string;
  /** The step in a sentence, in plain language. */
  summary: string;
  /** What it actually means for the client — written to reduce anxiety, not to sound rigorous. */
  detail: string;
}

/**
 * How the work actually runs.
 *
 * The emotional job of this list is RELIEF, which is why it is six short steps and not a
 * methodology. Someone reading it should finish thinking "okay, that's manageable, and I don't
 * have to drive it" — so each `detail` says what happens TO them or FOR them, and never asks
 * them to prepare anything.
 *
 * Steps 05 and 06 are the ones that matter most and the ones agencies usually skip. A process
 * that ends at LAUNCH is describing a project. Ending at IMPROVE is the difference between
 * buying a deliverable and having someone paying attention afterward — and it is the honest
 * argument for why marketing is ongoing rather than a one-time purchase.
 */
export const processSteps: ProcessStep[] = [
  {
    number: "01",
    label: "Understand",
    summary: "We learn the business.",
    detail:
      "What you sell, who buys it, what makes the good customers good, and what you've already tried. Mostly this step is us asking questions and listening.",
  },
  {
    number: "02",
    label: "Strategize",
    summary: "We figure out what needs to change.",
    detail:
      "Not everything — the specific things standing between your business and the impression it should be making. You get told what we found and why, in plain language.",
  },
  {
    number: "03",
    label: "Create",
    summary: "We turn the strategy into the brand, website, content, or campaign.",
    detail:
      "This is where it becomes something you can look at. You see it as it takes shape, not as a reveal at the end.",
  },
  {
    number: "04",
    label: "Launch",
    summary: "We put it into the real world.",
    detail:
      "The part most people dread. It's ours — the setup, the testing, the moving pieces, the things that go wrong at 6pm on a Friday.",
  },
  {
    number: "05",
    label: "Learn",
    summary: "We see what people respond to.",
    detail:
      "Real behavior beats opinions, including ours. What people actually click, read, and act on tells us more than any planning meeting did.",
  },
  {
    number: "06",
    label: "Improve",
    summary: "We keep making it stronger.",
    detail:
      "Marketing isn't a thing you finish. We adjust what's underperforming and push harder on what's working.",
  },
];
