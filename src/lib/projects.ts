/**
 * TODO: replace with real project data, or swap this module for a CMS/content-collection
 * fetch. Every route in the app reads from this array so the shape below (`Project`) is the
 * one contract the rest of the app depends on — keep it stable if you do wire up a CMS later.
 */

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  role: string;
  summary: string;
  description: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "RevoltLC.com (Coming Soon)",
    client: "TODO Client A",
    year: "2022",
    category: "Lacrosse Program",
    role: "Design & Development",
    summary: "TODO one-line summary of project one for list and card views.",
    description:
      "TODO full project description. Replace with real copy about the brief, the approach, and the outcome. This placeholder paragraph exists only to prove the layout handles multi-sentence body copy without breaking the grid.",
    tags: ["TODO", "Identity", "Web"],
  },
  {
    slug: "project-two",
    title: "TODO Project Two",
    client: "TODO Client B",
    year: "2023",
    category: "Product / App",
    role: "Art Direction",
    summary: "TODO one-line summary of project two for list and card views.",
    description:
      "TODO full project description. Replace with real copy about the brief, the approach, and the outcome. This placeholder paragraph exists only to prove the layout handles multi-sentence body copy without breaking the grid.",
    tags: ["TODO", "Product", "Motion"],
  },
  {
    slug: "project-three",
    title: "TODO Project Three",
    client: "TODO Client C",
    year: "2022",
    category: "Campaign",
    role: "Creative Direction",
    summary: "TODO one-line summary of project three for list and card views.",
    description:
      "TODO full project description. Replace with real copy about the brief, the approach, and the outcome. This placeholder paragraph exists only to prove the layout handles multi-sentence body copy without breaking the grid.",
    tags: ["TODO", "Campaign", "Print"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
