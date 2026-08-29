"use client";

import { useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { services } from "@/lib/services";

/**
 * TODO: no backend wired up yet. `handleSubmit` just fakes a successful send so the page has
 * something to show — replace it with a real submit (API route, Formspree, etc.) before launch.
 * Fields are plain native inputs with `required`/`type="email"` so browser validation and
 * keyboard/screen-reader behavior work with zero JS.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: replace with a real submission (API route, email service, CRM, etc.)
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <p className="max-w-md text-lg text-[var(--color-muted)]">
        Got it. We&apos;re reading it right now — expect to hear from us soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
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
        <div className="sm:col-span-2">
          <label htmlFor="serviceInterest" className="mb-2 block text-sm text-[var(--color-muted)]">
            What are you interested in?
          </label>
          <select
            id="serviceInterest"
            name="serviceInterest"
            required
            defaultValue=""
            className="w-full border border-[var(--color-form-border)] bg-[var(--color-form-bg)] px-4 py-3 text-base text-[var(--color-fg)] outline-none focus:border-[var(--color-form-border-focus)]"
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.number} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="keyFeature" className="mb-2 block text-sm text-[var(--color-muted)]">
            What&apos;s one goal you&apos;d like our services to help you accomplish?
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

      <MagneticButton
        as="button"
        type="submit"
        radius={90}
        className="btn-primary mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm text-[var(--color-button-primary-text)]"
      >
        Send
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
