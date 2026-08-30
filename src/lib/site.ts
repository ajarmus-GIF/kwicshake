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
