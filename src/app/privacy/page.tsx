import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { CONTACT_EMAIL, LOCATIONS } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy — Kwic Shake",
  description:
    "What Kwic Shake collects on this website, why, who handles it, and how to have it deleted. Short version: what you send us plus visit statistics from Google Analytics, never sold.",
};

const EFFECTIVE = "October 11, 2026";

/**
 * ── Privacy policy ──────────────────────────────────────────────────────────────────────────
 *
 * Written from what the site actually does, so keep it in step with the code:
 *   - the two forms (contact/ContactForm, contact/ComingSoonForm) post to Web3Forms, which
 *     emails the fields to the studio inbox. Add a field there → list it here.
 *   - Google Analytics 4 (components/GoogleAnalytics) is the only analytics and the only thing
 *     that sets cookies. No ad pixels. Adding one (Meta, TikTok, Google Ads remarketing) means
 *     rewriting "Analytics and cookies" and the short version, and adding an opt-out.
 *   - atmosphere/TimeOnSite keeps one timestamp in sessionStorage.
 *   - the home run's business-name box never leaves the page.
 *
 * Plain reading page on purpose: no reveal animations, so the text is there the moment it loads.
 */
export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <section className="bg-[var(--color-raised)] px-6 pb-16 pt-24 text-[var(--color-on-dark)] sm:pt-28">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-6">+ Privacy Policy</p>
          <h1 className="text-[clamp(2.25rem,6vw,4.25rem)] font-medium leading-[1.04] tracking-tight text-[var(--color-white)]">
            What we collect, and why. <span className="text-[var(--color-cherry)]">Never sold.</span>
          </h1>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
            Effective {EFFECTIVE}
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 pt-16 sm:pb-32">
        <div className="mx-auto max-w-3xl space-y-14 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
          <Block title="The short version">
            <ul className="list-disc space-y-2 pl-5">
              <li>We collect what you choose to send us through a form or by email.</li>
              <li>We use it to reply to you and, if we work together, to do the work.</li>
              <li>
                We use Google Analytics, which uses cookies, to see how many people visit and which
                pages they read. We don&apos;t run advertising trackers.
              </li>
              <li>We never sell your information or share it for advertising.</li>
              <li>
                Email <Mail /> and we&apos;ll show you, correct, or delete anything we have.
              </li>
            </ul>
          </Block>

          <Block title="Who we are">
            <p>
              Kwic Shake is a digital marketing agency working from {LOCATIONS.join(" and ")}.
              &ldquo;We&rdquo; and &ldquo;us&rdquo; in this policy mean Kwic Shake. This policy
              covers kwicshake.com. You can reach us about anything in it at <Mail />.
            </p>
          </Block>

          <Block title="What we collect">
            <p>
              <strong className="text-[var(--color-fg)]">When you fill in our contact form:</strong>{" "}
              your first and last name, email address, business name, what you pick as the thing
              that feels most broken, and anything you write in the message box.
            </p>
            <p>
              <strong className="text-[var(--color-fg)]">When you fill in the form on our coming-soon page:</strong>{" "}
              your name, business name, email address, phone number if you give one, and how you
              would like us to contact you.
            </p>
            <p>
              <strong className="text-[var(--color-fg)]">When you email us:</strong> your email
              address and whatever you include in the message.
            </p>
          </Block>

          <Block title="Analytics and cookies">
            <p>
              We use Google Analytics to understand how the site is used: how many people visit,
              which pages they read, how long they stay, and how they found us. To do that it sets
              a small number of first-party cookies (named <code>_ga</code> and{" "}
              <code>_ga_&hellip;</code>) and collects:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>the pages you view and the order you view them in</li>
              <li>the site or search that sent you here</li>
              <li>your device type, browser, operating system and screen size</li>
              <li>
                your approximate location (country and city), which Google works out from your IP
                address. Google Analytics doesn&apos;t store or show us the IP address itself.
              </li>
            </ul>
            <p>
              We see this as combined reports, not as a file on you. We use it only to improve the
              site, and not for advertising. Google processes the data under{" "}
              <Ext href="https://policies.google.com/technologies/partner-sites">
                its own policy for sites that use its services
              </Ext>
              .
            </p>
            <p>
              <strong className="text-[var(--color-fg)]">To opt out,</strong> block cookies for
              this site in your browser settings, or install Google&apos;s{" "}
              <Ext href="https://tools.google.com/dlpage/gaoptout">
                Analytics opt-out browser add-on
              </Ext>
              . The site works exactly the same either way.
            </p>
            <p>
              A few things happen only inside your own browser and are never sent to us:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                The &ldquo;you&apos;ve already been here for&rdquo; timer stores the time you
                arrived in your browser&apos;s session storage. It&apos;s deleted when you close
                the tab.
              </li>
              <li>
                Anything you type into the interactive pieces on our pages, like the business-name
                box on the homepage, stays on the page and is gone when you leave.
              </li>
            </ul>
            <p>
              Like every website, our hosting provider automatically records basic technical
              information when pages are requested, such as IP address, browser type and the page
              asked for. It uses these logs to deliver the site and protect it from abuse.
            </p>
          </Block>

          <Block title="How we use it">
            <ul className="list-disc space-y-2 pl-5">
              <li>To reply to your message and answer your questions.</li>
              <li>To prepare a quote or proposal you asked for.</li>
              <li>If you become a client, to do the work and run the project with you.</li>
              <li>To keep a record of our conversations with you.</li>
            </ul>
            <p>
              We won&apos;t add you to a mailing list or send you marketing unless you ask us to.
            </p>
          </Block>

          <Block title="Who else handles it">
            <p>
              We don&apos;t sell, rent or trade your information. It passes through a small number
              of services we use to run the site and the studio:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[var(--color-fg)]">Web3Forms</strong> receives form
                submissions and forwards them to our inbox (
                <Ext href="https://web3forms.com/privacy">their privacy policy</Ext>).
              </li>
              <li>
                <strong className="text-[var(--color-fg)]">Google Analytics</strong> collects the
                visit statistics described above.
              </li>
              <li>
                <strong className="text-[var(--color-fg)]">Our email provider</strong> stores the
                messages we send and receive.
              </li>
              <li>
                <strong className="text-[var(--color-fg)]">Our website host</strong> serves the
                site and keeps the technical logs described above.
              </li>
            </ul>
            <p>
              We may also share information if the law requires it, or to protect our rights or
              someone&apos;s safety.
            </p>
          </Block>

          <Block title="How long we keep it">
            <p>
              We keep messages and form submissions for as long as we need them to talk with you
              and, if we work together, for the length of that relationship plus whatever time the
              law or our own records require (for example, for taxes and invoices). If we
              don&apos;t end up working together, you can ask us to delete your enquiry at any
              time.
            </p>
          </Block>

          <Block title="Your choices and rights">
            <p>
              You can ask us to show you the information we have about you, correct it, or delete
              it. Email <Mail /> and we&apos;ll respond within 30 days. Depending on where you
              live, state privacy laws may give you more rights. We honor these requests for
              everyone, wherever you live, and we won&apos;t treat you differently for making one.
            </p>
          </Block>

          <Block title="Security">
            <p>
              The site is served over an encrypted (HTTPS) connection, and we limit who can access
              enquiries to the people at Kwic Shake who need them. No method of sending or storing
              information is completely secure, but we take reasonable care to protect what you
              send us.
            </p>
          </Block>

          <Block title="Children">
            <p>
              This site is for businesses and isn&apos;t aimed at children under 13. We don&apos;t
              knowingly collect information from them. If you think a child has sent us
              information, email us and we&apos;ll delete it.
            </p>
          </Block>

          <Block title="Other websites">
            <p>
              Some pages link to other websites, including our clients&apos; sites. Their own privacy policies apply once you leave kwicshake.com.
            </p>
          </Block>

          <Block title="Changes to this policy">
            <p>
              If we change how we handle information, we&apos;ll update this page and the
              effective date at the top. If a change is significant and we have your email,
              we&apos;ll tell you directly.
            </p>
          </Block>

          <Block title="Contact">
            <p>
              Questions or requests: <Mail />
              <br />
              Kwic Shake · {LOCATIONS.join(" · ")}
            </p>
          </Block>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-[clamp(1.4rem,3vw,1.9rem)] font-medium leading-tight tracking-tight text-[var(--color-fg)]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Mail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--color-cherry)] underline underline-offset-4">
      {CONTACT_EMAIL}
    </a>
  );
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--color-cherry)] underline underline-offset-4">
      {children}
    </a>
  );
}
