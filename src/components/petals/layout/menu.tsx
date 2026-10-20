import { getVoltra, getVoltraFree, navCopy, primaryNav, signIn, site } from "@/content/site";
import { ordinal } from "@/lib/ordinal";
import { spaced } from "@/lib/spaced";
import { LogoLink } from "../brand/mark";
import { ButtonLink } from "../primitives/button";
import { MenuButton } from "./menu-button";

// Full-screen menu, hidden until the menu button opens it. Every link closes it when followed (data-menu-link).
export function Menu() {
  return (
    <div className="menu" id="menu" role="dialog" aria-modal="true" aria-label={navCopy.menuLabel} lang={site.lang} hidden>
      <div className="menu__disc" aria-hidden="true" />{" "}
      <div className="menu__inner">
        <div className="menu__top">
          <LogoLink menuLink /> <MenuButton action="close" />
        </div>{" "}
        <nav aria-label={navCopy.menuLabel}>
          <ul className="menu__links">
            {spaced(
              primaryNav,
              (link) => link.href,
              (link, index) => (
                <li>
                  <a href={link.href} data-menu-link="">
                    <span className="menu__ix">{ordinal(index)}</span>
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>{" "}
        <div className="menu__foot">
          <ButtonLink href={getVoltra.href} variant="light" menuLink>
            {getVoltraFree}
          </ButtonLink>{" "}
          <ButtonLink href={signIn.href} variant="ghost" arrow="none" menuLink>
            {signIn.label}
          </ButtonLink>
        </div>{" "}
        {/* The bloom behind the links, drawn by the motion layer. */}
        <div className="menu__bloom" aria-hidden="true">
          <svg viewBox="-200 -200 400 400" focusable="false" data-bloom-glyph="menu" />
        </div>
      </div>
    </div>
  );
}
