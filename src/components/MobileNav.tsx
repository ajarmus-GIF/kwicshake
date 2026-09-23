"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { useLenis } from "@/components/scroll/SmoothScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * The small-screen nav: a hamburger that opens a full-screen panel. Used by both SiteHeader and
 * home's HeroHeader, which is what stops the two bars from drifting.
 *
 * This is the ONLY client component in the header. SiteHeader and HeroHeader stay server
 * components and keep rendering their real links inline for `sm:` and up, so the desktop nav is
 * still plain server-rendered HTML that cannot desynchronise from a page transition. Only the
 * disclosure — the part that genuinely needs state — ships JS.
 *
 * ── The panel is portalled to <body>, and has to be ────────────────────────────────────────
 * `position: fixed` resolves against the viewport ONLY while no ancestor establishes a containing
 * block for it — and `transform`, `perspective` and `filter` all do. Home's hero sets
 * `perspective: 1200px` on its section, and GSAP puts a transform on `[data-hero-line]` (the hero
 * bar) for the entrance stagger, so a panel rendered in place there is trapped inside the header
 * bar's own box: `inset-0` spans that strip instead of the screen, the backdrop covers a sliver,
 * and the links spill over the live page. The copy inside SiteHeader has no transformed ancestor,
 * which is why the bug only ever showed on the hero's hamburger. Portalling to <body> puts the
 * panel above every such containing block, so both copies behave identically.
 *
 * It also keeps the stacking honest: the panel's z-50 lands in the same context as the page
 * transition overlay's z-9999, so a navigation still paints over the menu rather than under it.
 *
 * ── The trigger does not become the X ───────────────────────────────────────────────────────
 * The open panel carries its own close button instead of morphing the hamburger into an X. Both
 * headers establish a stacking context (`sticky`/`absolute` with a z-index), so a z-index on the
 * trigger cannot lift it above a `fixed` panel that is painted outside that context — the panel
 * would cover the X no matter how high the number went. A close button inside the panel sidesteps
 * the whole fight, and focus returns to the trigger on close so keyboard users land where they
 * started.
 *
 * ── Closing ────────────────────────────────────────────────────────────────────────────────
 * Two paths, both needed. `pathname` covers ordinary navigation. The `onClick` on the <nav>
 * covers tapping the link for the page you are already on, where the pathname never changes and
 * the effect would never fire — the click bubbles from the TransitionLink to the wrapper, which
 * is why the wrapper owns the handler (TransitionLink deliberately omits `onClick` from its props
 * so nothing can stomp on its own navigation handler).
 *
 * ── Scroll lock ────────────────────────────────────────────────────────────────────────────
 * Lenis has to be stopped, not just `overflow: hidden`-ed: it intercepts wheel/touch and animates
 * the page itself, so it happily keeps scrolling behind an overflow-hidden body. Both are applied
 * because `useLenis()` is null under reduced motion (SmoothScroll never instantiates it there)
 * and the native lock is the only thing holding the page still in that case. No scrollbar-width
 * compensation is needed — globals.css hides scrollbars, so locking shifts nothing.
 */
type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  triggerClassName = "",
}: {
  links: NavLink[];
  /** Extra classes for the hamburger itself — HeroHeader uses it to add a shadow over the photo. */
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  // document.body does not exist while rendering on the server, so the portal can only be
  // created after mount. The panel is closed and inert at that point, so nothing is lost by it
  // being absent from the server-rendered HTML — and the links are still in that HTML via the
  // `sm:`-and-up <nav>, which is display:none rather than removed.
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lenis = useLenis();

  // Tailwind's `sm` is 40rem. Kept in sync by hand with the `sm:hidden`/`sm:flex` classes below:
  // if that breakpoint ever moves, this query moves with it.
  const isWideEnoughForInlineNav = useMediaQuery("(min-width: 40rem)");

  /** `restoreFocus` is false for navigation (the new page owns focus) and true for Escape /
      backdrop / close button, where the trigger is where the user expects to land. */
  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigating away closes the panel. It happens behind the transition overlay (z-9999, well
  // above this panel's z-50), so the close is never seen.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Rotating to landscape or resizing past the breakpoint hides the panel via `sm:hidden` while
  // leaving `open` true — the state would then be stale and the scroll lock would stay applied
  // to a page with no visible menu.
  useEffect(() => {
    if (isWideEnoughForInlineNav) setOpen(false);
  }, [isWideEnoughForInlineNav]);

  useEffect(() => {
    if (!open) return;

    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Escape is bound to the document rather than the panel: clicking the backdrop leaves focus
    // on <body>, and a panel-scoped handler would never see the keypress.
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("keydown", onEscape);

    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, lenis, close]);

  // Focus moves into the panel on open so the next Tab lands inside it rather than on whatever
  // followed the trigger in the document. Deferred a frame because an element cannot take focus
  // while its computed `visibility` is still `hidden` — the class flips in the same commit, but
  // waiting for the next frame guarantees style has been resolved before we ask.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-menu-focus-first]")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  /** Tab wrap. Without it, tabbing past the last link walks into the page behind the panel,
      which is `inert` to assistive tech but would still be a confusing place to be. */
  const trapTab = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>("a[href], button");
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  /* Kept mounted rather than conditionally rendered so it can fade both ways. `inert` is what
     makes that safe: while closed the links are unreachable by tab, click, and screen reader,
     which a plain `opacity-0` would not achieve. `visibility` transitions alongside opacity so
     the panel stays painted for the length of the fade-out instead of vanishing at once. */
  const panel = (
    <div
      ref={panelRef}
      id={panelId}
      inert={!open}
      onKeyDown={trapTab}
      className={`fixed inset-0 z-50 transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none sm:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-[var(--color-raised)]"
        onClick={() => close(true)}
      />

      <div className="relative flex h-full flex-col px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Plain text, not a link: "Home" is already in `links`, and a second route to it
              would only lengthen the focus order inside a trap. */}
          <span className="brand-wordmark text-sm font-bold tracking-tight">
            <span className="text-[var(--color-white)]">Kwic </span>
            <span className="brand-shake">Shake</span>
          </span>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => close(true)}
            className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center text-[var(--color-on-dark)]"
          >
            <span aria-hidden="true" className="relative block h-4 w-6">
              <span className="absolute left-0 top-[7px] h-0.5 w-full rotate-45 rounded-full bg-current" />
              <span className="absolute left-0 top-[7px] h-0.5 w-full -rotate-45 rounded-full bg-current" />
            </span>
          </button>
        </div>

        <nav
          aria-label="Mobile"
          onClick={() => close(false)}
          className="mt-10 flex flex-col"
        >
          {links.map((link, index) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              data-menu-focus-first={index === 0 ? "" : undefined}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`display-face border-b border-[var(--color-border)] py-4 text-3xl text-[var(--color-on-dark)] transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              // Stagger only on the way in: on the way out the panel fades as one piece, so
              // holding the delays would leave the last link hanging after the rest had gone.
              style={{ transitionDelay: open ? `${80 + index * 45}ms` : "0ms" }}
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        <div className="mt-auto pb-2">
          <TransitionLink
            href="/contact"
            onClickCapture={() => close(false)}
            className="btn-primary block rounded-full px-5 py-4 text-center text-xs font-bold uppercase tracking-widest text-[var(--color-button-primary-text)]"
          >
            Let&apos;s Talk
          </TransitionLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className={`-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center sm:hidden ${triggerClassName}`}
      >
        {/* h-4 over three 2px bars at 0 / 7 / 14 — the last bar's 14 + 2 fills the 16px box. */}
        <span aria-hidden="true" className="relative block h-4 w-6">
          <span className="absolute left-0 top-0 h-0.5 w-full rounded-full bg-current" />
          <span className="absolute left-0 top-[7px] h-0.5 w-full rounded-full bg-current" />
          <span className="absolute left-0 top-[14px] h-0.5 w-full rounded-full bg-current" />
        </span>
      </button>

      {mounted && createPortal(panel, document.body)}
    </>
  );
}
