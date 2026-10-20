import { LOCKUP, MARK, viewBoxOf } from "./mark-geometry";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";

const href = (id: string) => `#${id}`;

type MarkGlyphProps = {
  // The single-colour mark (currentColor) instead of the gradient one.
  mono?: boolean;
  className?: string;
  // Hidden from assistive tech and keyboard focus. Inside an already hidden or role="img" container the original
  // leaves these off.
  decorative?: boolean;
};

// The mark on its own, drawn from the sprite.
export function MarkGlyph({ mono, className, decorative }: MarkGlyphProps) {
  return (
    <svg
      className={className}
      viewBox={viewBoxOf(MARK.useBox)}
      aria-hidden={decorative ? "true" : undefined}
      focusable={decorative ? "false" : undefined}
    >
      <use href={href(mono ? MARK.monoId : MARK.id)} />
    </svg>
  );
}

// Mark plus wordmark. Decorative: the surrounding link carries the name.
export function Lockup() {
  return (
    <svg className="lockup" viewBox={viewBoxOf(LOCKUP.box)} aria-hidden="true" focusable="false">
      <use href={href(LOCKUP.id)} />
    </svg>
  );
}

type LogoLinkProps = {
  className?: string;
  // Motion hooks: closes the menu when followed (data-menu-link), or rises with the footer (data-foot-in).
  menuLink?: boolean;
  footIn?: boolean;
};

// The lockup as the link back to the top (nav, menu and footer). The spaces around the lockup are the original's.
export function LogoLink({ className, menuLink, footIn }: LogoLinkProps) {
  return (
    <a
      className={cx("nav__logo", className)}
      href={site.homeHref}
      aria-label={site.homeLabel}
      data-menu-link={menuLink ? "" : undefined}
      data-foot-in={footIn ? "" : undefined}
    >
      {" "}
      <Lockup />{" "}
    </a>
  );
}
