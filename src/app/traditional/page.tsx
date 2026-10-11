import { TraditionalHome } from "@/components/reveal/TraditionalHome";

// The scrolling homepage, offered as the alternative to the interactive one at `/`. Both link to
// each other from a pill in the top-left of their heroes (concepts/HomepageSwitch).
export const metadata = {
  title: "Kwic Shake — Traditional Homepage",
  alternates: { canonical: "/traditional" },
};

export default function TraditionalHomePage() {
  return <TraditionalHome switchToInteractive />;
}
