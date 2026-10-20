import { footerCopy, primaryNav, site } from "@/content/site";
import { spaced } from "@/lib/spaced";
import { LogoLink } from "../brand/mark";

// The footer rises in with data-foot-in; the bloom behind it is drawn by the motion layer.
export function Footer() {
  return (
    <footer className="footer" data-chapter="footer" lang={site.lang}>
      <div className="footer__bloom" aria-hidden="true">
        <svg viewBox="-300 -300 600 600" focusable="false" data-footer-bloom="" />
      </div>{" "}
      <div className="wrap footer__inner">
        <LogoLink className="footer__logo" footIn />{" "}
        <p className="footer__tag" data-foot-in="">
          {site.tagline}
        </p>{" "}
        <nav aria-label={footerCopy.label} data-foot-in="">
          <ul className="footer__links">
            {spaced(
              primaryNav,
              (link) => link.href,
              (link) => (
                <li>
                  <a href={link.href}>{link.label}</a>
                </li>
              ),
            )}{" "}
            <li className="footer__sep" aria-hidden="true" />{" "}
            {spaced(
              footerCopy.quietLinks,
              (link) => link.label,
              (link) => (
                <li>
                  <a className="footer__quiet" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>{" "}
        <span className="footer__rule" aria-hidden="true" />{" "}
        <p className="footer__legal" data-foot-in="">
          {spaced(
            footerCopy.legal,
            (line) => line,
            (line) => (
              <span>{line}</span>
            ),
          )}
        </p>
      </div>
    </footer>
  );
}
