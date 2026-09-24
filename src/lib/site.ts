/**
 * Single source of truth for the studio's own contact details.
 *
 * This exists because the address was previously hardcoded in four places and one of them
 * (the /contact page — the single page whose entire job is getting people to make contact)
 * still read `TODO@example.com` at deploy time. A literal repeated across files is a literal
 * that will eventually disagree with itself.
 */
export const CONTACT_EMAIL = "info@kwicshake.com";

/**
 * Web3Forms access key. This is a PUBLIC identifier by design — Web3Forms is a client-side
 * form service, so the key ships in the browser bundle and there is nothing to hide. It
 * identifies the destination inbox; it does not authorize reading submissions.
 *
 * Spam protection is the `botcheck` honeypot in ContactForm, not secrecy of this key.
 */
export const WEB3FORMS_ACCESS_KEY = "dd1e6d63-581e-4bc1-a7f7-bf933cceec2d";

/**
 * Web3Forms access key for the /comingsoon page's form, kept separate from the main contact
 * form's so those leads land in their own inbox. Public by design, same as the key above.
 */
export const COMING_SOON_WEB3FORMS_ACCESS_KEY = "80905338-5928-4a43-b8bb-9b78c570518a";

/**
 * The brand line. It is the site's recurring idea rather than a slogan bolted onto a logo, so
 * it is imported wherever it appears (footer, the home page's emotional close, the end of the
 * work story, the About close) instead of being retyped — the same reason CONTACT_EMAIL lives
 * here. If it ever changes, it changes in one place and the whole site follows.
 *
 * Deliberately NOT dropped into every section. It lands at the end of an argument, where it
 * reads as the conclusion the section just earned; sprinkled everywhere it would read as a
 * tagline someone was told to repeat.
 */
export const TAGLINE = "Make them remember you.";

/**
 * Secondary branding. It establishes the category — what this company actually is — and that
 * is a supporting job, not the headline job. It belongs in eyebrows, the footer lockup, and
 * metadata; it should never be the largest type on a page. The emotionally important line at
 * the top of the home page is the question, not the category.
 */
export const DESCRIPTOR = "A Digital Marketing Agency";
