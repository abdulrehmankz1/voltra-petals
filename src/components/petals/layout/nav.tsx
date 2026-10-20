import { getVoltra, navCopy, primaryNav, signIn, site } from "@/content/site";
import { spaced } from "@/lib/spaced";
import { LogoLink } from "../brand/mark";
import { ButtonLink } from "../primitives/button";
import { MenuButton } from "./menu-button";

// Fixed header. The motion layer solidifies, tones and hides it on scroll (data-nav); the menu button opens #menu
// on narrow screens.
export function Nav() {
  return (
    <header className="nav" data-nav="" lang={site.lang}>
      <div className="nav__bg" aria-hidden="true" />{" "}
      <div className="nav__bar">
        <LogoLink />{" "}
        <nav className="nav__links" aria-label={navCopy.label}>
          {spaced(
            primaryNav,
            (link) => link.href,
            (link) => (
              <a href={link.href}>{link.label}</a>
            ),
          )}
        </nav>{" "}
        <div className="nav__actions">
          <a className="nav__signin" href={signIn.href}>
            {signIn.label}
          </a>{" "}
          <ButtonLink href={getVoltra.href} variant="light" size="sm" className="nav__cta" arrow="wide" magnetic>
            {getVoltra.label}
            <span className="no-xs">{getVoltra.free}</span>
          </ButtonLink>{" "}
          <MenuButton action="open" />
        </div>
      </div>
    </header>
  );
}
