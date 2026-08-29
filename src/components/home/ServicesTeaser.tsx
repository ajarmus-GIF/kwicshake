import { TextReveal } from "@/components/text/TextReveal";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { serviceIcons } from "@/components/services/serviceIcons";
import { services } from "@/lib/services";

/**
 * Condensed version of the /services page's icon-and-glow treatment — a card per service
 * instead of a full-bleed section per service — so the home page actually pitches the work
 * instead of making a visitor click through to /services to find out what the studio does.
 *
 * Renders every entry in `services`, so the count follows that file. At six it lays out as two
 * rows of three, which is why the row gap is set separately from the column gap: `gap-6` on
 * both axes was tuned when this grid only ever had one row, and it leaves the second row's
 * icons almost touching the first row's copy.
 */
export function ServicesTeaser() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div
        className="pointer-events-none absolute -top-1/4 right-[-15%] h-[55vw] max-h-[700px] w-[55vw] max-w-[700px] rounded-full opacity-[0.15] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
              + What We Do
            </p>
            <TextReveal as="h2" className="max-w-xl text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight">
              Six disciplines. One connected pitch.
            </TextReveal>
          </div>
          <TransitionLink
            href="/services"
            className="shrink-0 whitespace-nowrap text-sm text-[var(--color-fg)] underline decoration-[var(--color-cherry)] underline-offset-4 hover:text-[var(--color-cherry)]"
          >
            → All Services
          </TransitionLink>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-14">
          {services.map((service, index) => (
            <TransitionLink key={service.number} href="/services" className="group block">
              <div
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: "color-mix(in srgb, var(--color-cherry) 10%, transparent)",
                  boxShadow: "0 0 32px var(--color-glow)",
                }}
              >
                <ServiceIcon className="h-11 w-11 text-[var(--color-cherry)]">
                  {serviceIcons[index]}
                </ServiceIcon>
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
                {service.number} — {service.kicker}
              </p>
              <h3 className="mb-3 text-xl font-medium leading-snug transition-opacity group-hover:opacity-70">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">{service.description}</p>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
