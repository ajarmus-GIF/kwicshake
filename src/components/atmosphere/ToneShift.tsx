"use client";

import { useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import type { WinTone } from "@/lib/wins";

/**
 * A section whose background follows whatever is in view — the Kwic Wins feed's colour shift,
 * packaged for use anywhere. Mark the children that should drive it with
 * `data-tone-step="<tone>"`; while one crosses the middle of the screen the whole section
 * transitions to that tone (the transition itself is CSS, see `.wins-tone`).
 *
 * Reduced motion keeps the tracking: it is a state change, and `.wins-tone` already drops the
 * transition under that preference, so the colour simply switches.
 */
export function ToneShift({
  initial,
  className = "",
  children,
}: {
  initial: WinTone;
  className?: string;
  children: ReactNode;
}) {
  const scope = useRef<HTMLElement>(null);
  const [tone, setTone] = useState<string>(initial);

  useGSAP(
    () => {
      const steps = Array.from(
        scope.current?.querySelectorAll<HTMLElement>("[data-tone-step]") ?? []
      );
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setTone(step.dataset.toneStep ?? initial);
          },
        });
      });
    },
    { scope, dependencies: [initial] }
  );

  return (
    <section ref={scope} data-tone={tone} className={`tone-section wins-tone ${className}`}>
      {children}
    </section>
  );
}
