import Image from "next/image";

/**
 * Art-direction studies: the same phone, in the same purple room, wearing eight completely
 * different businesses. The Kwic Shake frame stays constant; each business keeps its own world.
 *
 * These are NOT client work and are always labelled that way — the creativity sells itself, and
 * passing a concept off as a client would undo the honesty the rest of the site trades on.
 *
 * Scrolls sideways (with snap) on phones, sits as a grid from md up.
 */
export const studies = [
  { src: "/images/concepts/study-sushi.jpg", industry: "Restaurant", name: "KŌRA Modern Sushi" },
  { src: "/images/concepts/study-salon.jpg", industry: "Salon", name: "Blush & Bloom" },
  { src: "/images/concepts/study-carpentry.jpg", industry: "Contractor", name: "Northwood Carpentry" },
  { src: "/images/concepts/study-therapy.jpg", industry: "Therapist", name: "Bright Horizon Therapy" },
  { src: "/images/concepts/study-accounting.jpg", industry: "Accountant", name: "Red Ledger Accounting" },
  { src: "/images/concepts/study-fishing.jpg", industry: "Outdoor brand", name: "Timberline" },
  { src: "/images/concepts/study-dog-walking.jpg", industry: "Dog walking", name: "PawTrail" },
  { src: "/images/concepts/study-video.jpg", industry: "Video editing", name: "Framework" },
] as const;

export function ConceptStudies({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
        {studies.map((s) => (
          <li key={s.src} className="w-[62vw] max-w-[16rem] shrink-0 snap-center md:w-auto md:max-w-none">
            <figure>
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-[var(--color-ash-22)] bg-black">
                <Image
                  src={s.src}
                  alt={`Concept study: a phone showing a website for ${s.name}, a fictional ${s.industry.toLowerCase()} business.`}
                  fill
                  sizes="(min-width: 768px) 24vw, 62vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                <span className="text-[var(--color-ink)]">{s.industry}</span>
                <span className="mx-2 text-[var(--color-cherry)]">/</span>
                {s.name}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Concept / art-direction studies. Fictional businesses, not clients.
      </p>
    </div>
  );
}
