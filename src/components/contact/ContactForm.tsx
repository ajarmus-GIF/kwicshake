"use client";

import { useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { CONTACT_EMAIL, WEB3FORMS_ACCESS_KEY } from "@/lib/site";

/**
 * Submits to Web3Forms, which relays the fields to the studio inbox.
 *
 * This previously called `preventDefault()`, set state to "sent", and did nothing else — so
 * every visitor was told "Got it, we're reading it right now" while their message was
 * discarded. The success copy below is therefore only shown after the API has confirmed
 * `success: true`; a network failure or a rejected submission lands in the error branch with
 * the direct address, because telling someone you have their message when you don't is worse
 * than showing them a failure.
 *
 * Fields stay plain native inputs with `required`/`type="email"`, so browser validation,
 * autofill, and screen-reader behaviour all work before any of this JS runs.
 *
 * `replyto` is set from the visitor's own email so hitting Reply in the inbox goes to them
 * rather than to Web3Forms. `botcheck` is Web3Forms' honeypot convention: it is hidden from
 * people, and a submission arriving with it filled is dropped as a bot.
 *
 * "Honestly, I don't know" in the "most broken" question is not filler. This page's headline
 * promises the visitor doesn't need to have everything figured out, and a required question with
 * only confident answers silently withdraws that promise at the last step — the one moment
 * someone is most likely to close the tab. Keeping it makes not knowing a legitimate answer
 * rather than a gap the visitor has to bluff their way past.
 */
const brokenOptions = [
  "Website",
  "Brand",
  "Getting found",
  "Advertising",
  "Social",
  "Honestly, I don't know",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("from_name", "Kwic Shake website");
    data.append(
      "subject",
      `New enquiry — ${data.get("businessName") || "Kwic Shake site"}`
    );
    const email = data.get("email");
    if (typeof email === "string") data.append("replyto", email);

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await response.json();
      if (response.ok && result.success) {
        form.reset();
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="max-w-md text-lg text-[var(--color-muted)]">
        Got it — that&apos;s with us now. One of us will read it properly and write back like
        a person, not a template.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      {/* Honeypot. `hidden` rather than off-screen positioning — Web3Forms only needs it to be
          unreachable by a person, and a genuinely hidden field can't be tabbed into by someone
          on a keyboard, which an off-screen one can. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="First name" name="firstName" autoComplete="given-name" required />
        <Field label="Last name" name="lastName" autoComplete="family-name" required />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="sm:col-span-2"
        />
        <Field
          label="Business name"
          name="businessName"
          autoComplete="organization"
          required
          className="sm:col-span-2"
        />
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 block text-sm text-[var(--color-muted)]">
            What feels most broken right now?
          </legend>
          <div className="flex flex-wrap gap-2">
            {brokenOptions.map((option) => (
              <label key={option} className="cursor-pointer">
                {/* Native radio kept (visually hidden) so `required`, keyboard arrows and
                    screen readers all behave; the pill is just its styled label. */}
                <input
                  type="radio"
                  name="mostBroken"
                  value={option}
                  required
                  className="peer sr-only"
                />
                <span className="inline-block border border-[var(--color-form-border)] bg-[var(--color-form-bg)] px-4 py-2 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-form-border-focus)] peer-checked:border-[var(--color-cherry)] peer-checked:text-[var(--color-cherry)] peer-focus-visible:border-[var(--color-form-border-focus)]">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          <label htmlFor="keyFeature" className="mb-2 block text-sm text-[var(--color-muted)]">
            What&apos;s one thing you wish your business did better online?
          </label>
          <textarea
            id="keyFeature"
            name="keyFeature"
            required
            rows={4}
            className="w-full border border-[var(--color-form-border)] bg-[var(--color-form-bg)] px-4 py-3 text-base text-[var(--color-fg)] outline-none focus:border-[var(--color-form-border-focus)]"
          />
        </div>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-6 border border-[var(--color-cherry)]/40 px-4 py-3 text-sm leading-relaxed text-[var(--color-fg)]"
        >
          That didn&apos;t go through — your message is still in the form, so nothing is lost.
          Try again, or email us directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[var(--color-cherry)] underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      <MagneticButton
        as="button"
        type="submit"
        radius={90}
        className="btn-primary mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm text-[var(--color-button-primary-text)]"
      >
        {status === "sending" ? "Sending…" : "Start the Conversation"}
      </MagneticButton>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm text-[var(--color-muted)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full border border-[var(--color-form-border)] bg-[var(--color-form-bg)] px-4 py-3 text-base text-[var(--color-fg)] outline-none focus:border-[var(--color-form-border-focus)]"
      />
    </div>
  );
}
