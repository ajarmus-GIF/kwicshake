import { TextReveal } from "@/components/text/TextReveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = { title: "Contact — Kwic Shake" };

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <div className="relative overflow-hidden px-6 py-24">
        <div
          className="pointer-events-none absolute -top-1/4 right-[-10%] h-[50vw] max-h-[650px] w-[50vw] max-w-[650px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Let&apos;s Talk
          </p>
          {/* `text-balance` evens the line lengths so "website?" can't end up stranded alone on
              its own line; the wider max-width gives "beyond a website?" room to sit together. */}
          <TextReveal as="h1" className="max-w-3xl text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight">
            Ready to grow{" "}
            <span className="text-[var(--color-cherry)]">beyond a website?</span>
          </TextReveal>
          <TextReveal as="p" className="mt-6 mb-16 max-w-md text-lg text-[var(--color-muted)]">
            Tell us where the business is now and where you want it to go — we&apos;ll handle
            the part in between.
          </TextReveal>

          <ContactForm />

          <p className="mt-16 text-sm text-[var(--color-muted)]">
            Prefer email? Reach us directly at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--color-fg)] underline decoration-[var(--color-cherry)] underline-offset-4 hover:text-[var(--color-cherry)]"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
