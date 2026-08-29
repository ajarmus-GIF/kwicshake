import { PageTransition } from "@/components/transition/PageTransition";

/**
 * App Router remounts template.tsx (and everything inside it) on every navigation, while
 * layout.tsx persists — that's the whole reason PageTransition's "reveal" logic lives here and
 * not in layout.tsx. See src/components/transition/*.tsx for the full mechanism.
 */
export default function RootTemplate({ children }: LayoutProps<"/">) {
  return <PageTransition>{children}</PageTransition>;
}
