"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { CONTACT_EMAIL, COMING_SOON_WEB3FORMS_ACCESS_KEY } from "@/lib/site";

/**
 * The short form on /comingsoon: name, business, email, phone, and how they'd like to be
 * reached. Submits to Web3Forms (its own access key, see site.ts) exactly as ContactForm does (see that file for why success is
 * only shown after the API confirms it, and for the `botcheck` honeypot).
 *
 * Phone is only required when the visitor picks phone as their preferred contact. Demanding a
 * number from someone who just asked to be emailed is the kind of field that loses the lead.
 *
 * Kept compact on purpose: the page has to fit one screen, Instagram's in-app browser included.
 */
export function ComingSoonForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [preferred, setPreferred] = useState<"Email" | "Phone">("Email");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    data.append("access_key", COMING_SOON_WEB3FORMS_ACCESS_KEY);
    data.append("from_name", "Kwic Shake coming-soon page");
    data.append("subject", `Coming-soon lead — ${data.get("businessName") || "Kwic Shake"}`);
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
      <div role="status" className="py-6 text-center">
        <p className="display-face text-2xl text-[var(--color-white)]">
          Deal. <span className="text-[var(--color-cherry)]">We&apos;ll be in touch.</span>
        </p>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Thanks for believing in us first. We&apos;ll reach out by{" "}
          {preferred === "Phone" ? "phone" : "email"} soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-4">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Business" name="businessName" autoComplete="organization" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field
          label={preferred === "Phone" ? "Phone" : "Phone (optional)"}
          name="phone"
          type="tel"
          autoComplete="tel"
          required={preferred === "Phone"}
        />
      </div>

      <fieldset className="mt-4 sm:mt-5">
        <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
          Best way to reach you
        </legend>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {(["Email", "Phone"] as const).map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-focus-ring)] ${
                preferred === option
                  ? "border-[var(--color-cherry)] bg-[color-mix(in_srgb,var(--color-cherry)_14%,transparent)] text-[var(--color-white)]"
                  : "border-[var(--color-form-border)] text-[var(--color-muted)] hover:border-[var(--color-cherry)]"
              }`}
            >
              <input
                type="radio"
                name="preferredContact"
                value={option}
                checked={preferred === option}
                onChange={() => setPreferred(option)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`grid h-4 w-4 shrink-0 place-items-center border ${
                  preferred === option
                    ? "border-[var(--color-cherry)] bg-[var(--color-cherry)]"
                    : "border-[var(--color-form-border)]"
                }`}
              >
                {preferred === option && (
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-[var(--color-paper)]">
                    <path
                      d="M2.5 6.2 5 8.5l4.5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 border border-[var(--color-cherry)]/40 px-3 py-2 text-xs leading-relaxed text-[var(--color-fg)]"
        >
          That didn&apos;t go through. Try again, or email us at{" "}
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
        className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)] sm:mt-6"
      >
        {status === "sending" ? "Sending…" : "Let's Make a Deal →"}
      </MagneticButton>
    </form>
  );
}

function Field({
  label,
  name,
  ...input
}: { label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs uppercase tracking-widest text-[var(--color-muted)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...input}
        className="w-full border border-[var(--color-form-border)] bg-[var(--color-form-bg)] px-3 py-2.5 text-base text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-form-border-focus)]"
      />
    </div>
  );
}
