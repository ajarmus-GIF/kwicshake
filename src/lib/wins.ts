/**
 * Kwic Wins — free, one-sitting marketing resources.
 *
 * These pages are the landing spot for social: someone sees a reel, taps the link, and should get
 * the whole thing here with no email wall in front of it. The resource IS the pitch — the visitor
 * who uses one of these and sees it work is the visitor who comes back to hire the people who
 * wrote it. So every post has to be genuinely usable on its own.
 *
 * The same honesty rule as lib/projects.ts applies: no invented statistics. "Reviews help" is
 * true; "reviews raise conversions 270%" is a number we did not measure, and one of those makes
 * every true sentence on the site suspect.
 *
 * ── Adding a win ────────────────────────────────────────────────────────────────────────────
 * Append an entry below. Newest first reads best on the feed, so add to the TOP of the array.
 * `tone` picks the colour the feed shifts to while this post is on screen; alternate them so
 * neighbours never share one. Images are served from /public, and a portrait or 4:3 shot crops
 * best into the feed's tall frame.
 */

/** Colour moods the feed moves through. Values live in globals.css (`[data-tone]`). */
export type WinTone = "cherry" | "nova" | "dusk" | "night" | "lilac";

export type WinBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  /** A copy-paste box — scripts, templates, prompts. Rendered monospaced with a label. */
  | { type: "template"; label: string; text: string }
  /** A short highlighted aside. */
  | { type: "callout"; label: string; text: string };

export interface Win {
  slug: string;
  title: string;
  /** One line, written like the caption on the reel that sent people here. */
  hook: string;
  /** What kind of resource it is — Checklist, Script, Template, Guide. */
  format: string;
  /** Honest time to use it, in minutes. */
  minutes: number;
  image: string;
  imageAlt: string;
  tone: WinTone;
  body: WinBlock[];
}

export const wins: Win[] = [
  {
    slug: "five-second-homepage-test",
    title: "The 5‑Second Homepage Test",
    hook: "Show your homepage to a stranger for five seconds. If they can't answer these three questions, neither can your customers.",
    format: "Checklist",
    minutes: 10,
    image: "/images/site-on-screen.jpg",
    imageAlt: "A website open on a laptop screen",
    tone: "night",
    body: [
      {
        type: "p",
        text: "People decide whether to stay on a website almost instantly. They aren't reading in that moment. They're scanning for a reason to keep going. This test tells you whether your homepage gives them one.",
      },
      { type: "h", text: "How to run it" },
      {
        type: "list",
        ordered: true,
        items: [
          "Find someone who has never seen your site. A friend's partner, a neighbour, anyone outside your industry.",
          "Open your homepage on their phone, not your laptop. That's where most of your visitors are.",
          "Let them look for five seconds, then take the phone back.",
          "Ask the three questions below, and write down their exact words.",
        ],
      },
      { type: "h", text: "The three questions" },
      {
        type: "list",
        ordered: true,
        items: [
          "What does this business do?",
          "Who is it for?",
          "What should I do next if I'm interested?",
        ],
      },
      {
        type: "callout",
        label: "Reading the results",
        text: "If they answered all three in plain words, your homepage is doing its job. If they hesitated, guessed, or described a different business, the top of your page is talking about you instead of them.",
      },
      { type: "h", text: "The quick fixes" },
      {
        type: "list",
        items: [
          "Rewrite your headline to say what you do and who it's for, in the words a customer would use. \"Roof repair for Twin Cities homeowners\" beats \"Excellence in every project.\"",
          "Put one button above the fold, and make its label the next step: \"Get a quote\", \"Book a call\", \"See the menu\".",
          "Swap any stock photo at the top for a real photo of your work, your team, or your place.",
          "Run the test again with someone new. Repeat until a stranger gets all three questions right.",
        ],
      },
    ],
  },
  {
    slug: "google-business-profile-tune-up",
    title: "The Google Business Profile Tune-Up",
    hook: "For a lot of people, your Google listing is the first thing they see, not your website. Here's how to make it count in one afternoon.",
    format: "Checklist",
    minutes: 45,
    image: "/images/storefront-night.jpg",
    imageAlt: "A lit storefront at night",
    tone: "dusk",
    body: [
      {
        type: "p",
        text: "When someone searches for a business like yours nearby, Google often shows a map and a few listings before any websites. Many people call, get directions, or move on without clicking further. That listing is free, and most businesses fill it in once and never touch it again.",
      },
      { type: "h", text: "The checklist" },
      {
        type: "list",
        items: [
          "Primary category: choose the most specific one that fits. \"Italian restaurant\" over \"Restaurant\". Then add secondary categories for everything else you genuinely do.",
          "Description: start with what you do and where, in plain words. Mention the services people actually search for.",
          "Hours: confirm regular hours and add holiday hours before every holiday. Wrong hours are one of the fastest ways to lose a customer for good.",
          "Photos: add real, recent photos of your exterior (so people recognise you on arrival), interior, team, and work. Add a few new ones every month.",
          "Services or menu: list every service with a short description. Each one is another chance to match a search.",
          "Questions and answers: post the five questions you hear most often, and answer them yourself.",
          "Website link: point it at the page that best matches the search, not automatically your homepage.",
        ],
      },
      {
        type: "callout",
        label: "The habit that matters most",
        text: "Reply to every review, good and bad, within a few days. Future customers read your replies as much as the reviews. A calm, specific response to a bad review often builds more trust than a five-star one.",
      },
      { type: "h", text: "Keep it alive" },
      {
        type: "p",
        text: "Set a monthly reminder: add two new photos, post one update (an offer, an event, a new service), and check that your hours are still right. Fifteen minutes a month keeps the listing from going stale.",
      },
    ],
  },
  {
    slug: "thirty-days-of-posts",
    title: "30 Days of Posts From One Afternoon",
    hook: "Stop staring at a blank caption every morning. Batch a month of content in one sitting with this framework.",
    format: "Template",
    minutes: 120,
    image: "/images/service-social-phone.jpg",
    imageAlt: "A phone showing a social media feed",
    tone: "lilac",
    body: [
      {
        type: "p",
        text: "Posting consistently is hard when every post starts from zero. The fix is to decide what kinds of posts you make once, then fill them in all at once. Five post types, six of each, gives you a month.",
      },
      { type: "h", text: "The five post types" },
      {
        type: "list",
        ordered: true,
        items: [
          "Behind the scenes: how something gets made, prepped, fixed or delivered. People trust what they can see.",
          "The question you get asked most: answer one common customer question per post.",
          "Proof: a finished job, a happy customer (with permission), a before and after.",
          "Myth vs. truth: something people in your industry get wrong, and what's actually true.",
          "Ask: a clear invitation to book, visit, call, or buy, with a reason to do it now.",
        ],
      },
      { type: "h", text: "The afternoon, step by step" },
      {
        type: "list",
        ordered: true,
        items: [
          "Spend 20 minutes writing six ideas for each type. Short phrases are fine.",
          "Spend an hour capturing. Walk through your business with your phone and film or photograph everything on the list.",
          "Spend 30 minutes writing captions using the template below.",
          "Spend 10 minutes scheduling. Rotate the types so no two of the same land back to back.",
        ],
      },
      {
        type: "template",
        label: "Caption template",
        text: "[Hook: one line that stops the scroll, a surprising fact, a question, or a bold claim]\n\n[2–3 sentences: the story, the answer, or the detail]\n\n[One clear next step: \"Book through the link in our bio\" / \"Save this for later\" / \"Tell us in the comments\"]",
      },
      {
        type: "callout",
        label: "Rule of thumb",
        text: "Only one post in five should be an Ask. The other four earn the right to make it.",
      },
    ],
  },
  {
    slug: "review-request-script",
    title: "The Review Request Script",
    hook: "Happy customers rarely leave reviews unless someone asks. Here's exactly what to say, and when.",
    format: "Script",
    minutes: 15,
    image: "/images/studio-workspace.jpg",
    imageAlt: "A desk in a bright studio workspace",
    tone: "cherry",
    body: [
      {
        type: "p",
        text: "Unhappy customers often review without being asked. Happy ones usually mean to and forget. That gap is why so many great businesses have thin review pages. Closing it takes one well-timed message.",
      },
      { type: "h", text: "When to ask" },
      {
        type: "p",
        text: "Ask at the moment the customer is happiest: right after the job is finished, the order arrives, or they tell you they loved it. Waiting a week means asking someone who has already moved on.",
      },
      { type: "h", text: "What to send" },
      {
        type: "template",
        label: "Text message",
        text: "Hi [Name], it's [Your name] from [Business]. Thanks again for [the specific thing you did for them]. If you have a minute, a quick Google review would mean a lot to a small business like ours: [link]. Thank you!",
      },
      {
        type: "template",
        label: "Email",
        text: "Subject: Quick favour?\n\nHi [Name],\n\nThanks for choosing us for [the specific job]. We hope [the result] is everything you wanted.\n\nIf you were happy with how it went, would you mind leaving a short review? It takes about a minute and it helps other people in [your area] find us.\n\n[Review link]\n\nThanks,\n[Your name]",
      },
      { type: "h", text: "Make it easy" },
      {
        type: "list",
        items: [
          "Use your direct review link. In your Google Business Profile, find \"Ask for reviews\" and copy the short link it gives you.",
          "Mention the specific thing you did. It reminds them of the experience and makes the message feel personal.",
          "Send it once. A single friendly follow-up a few days later is fine; more than that isn't.",
          "Never offer a discount or gift in exchange for a review. Google's rules prohibit it, and it can get reviews removed.",
        ],
      },
    ],
  },
  {
    slug: "find-the-words-customers-search",
    title: "Find the Words Your Customers Actually Search",
    hook: "You call it one thing. Your customers type something else into Google. Here's a free way to find out what.",
    format: "Guide",
    minutes: 30,
    image: "/images/service-search-archive.jpg",
    imageAlt: "Rows of archive drawers",
    tone: "nova",
    body: [
      {
        type: "p",
        text: "Businesses describe themselves with industry language. Customers search with everyday language. If your website uses the first and your customers type the second, you can be the best answer and still not show up.",
      },
      { type: "h", text: "Four free places to look" },
      {
        type: "list",
        ordered: true,
        items: [
          "Google autocomplete: start typing your service into Google and write down every suggestion. Then try adding \"near me\", \"cost\", \"best\", and \"how to\".",
          "\"People also ask\": search your main service and open the questions box. Each question is something real people wanted to know.",
          "Related searches: scroll to the bottom of the results page for more phrases people use.",
          "Your own inbox: read your last 20 customer emails, messages and call notes. Highlight the words customers use to describe their problem.",
        ],
      },
      { type: "h", text: "Put the words to work" },
      {
        type: "list",
        items: [
          "Use the most common phrase in your homepage headline or the first line under it.",
          "Give each main service its own page, titled with the words customers search for.",
          "Turn the \"People also ask\" questions into an FAQ section with straight answers.",
          "Use the same phrases in your Google Business Profile description and services.",
        ],
      },
      {
        type: "callout",
        label: "Example",
        text: "A business that calls itself \"residential HVAC solutions\" may find its customers searching \"furnace repair\" and \"AC not cooling\". Those phrases belong on the site, word for word.",
      },
    ],
  },
];

export function getWin(slug: string): Win | undefined {
  return wins.find((win) => win.slug === slug);
}

/** The post after this one, wrapping to the first — keeps a reader moving like a feed would. */
export function getNextWin(slug: string): Win {
  const index = wins.findIndex((win) => win.slug === slug);
  return wins[(index + 1) % wins.length];
}
