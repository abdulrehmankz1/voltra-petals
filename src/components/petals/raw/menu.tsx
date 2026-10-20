// Full-screen menu
export function Menu() {
  return (
    <div className="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" lang="en-GB" hidden>
      <div className="menu__disc" aria-hidden="true" />
      {" "}
      <div className="menu__inner">
        <div className="menu__top">
          <a className="nav__logo" href="#top" data-menu-link="" aria-label="Voltra home">
            {" "}
            <svg className="lockup" viewBox="0 0 258.9506 60.48" aria-hidden="true" focusable="false">
              <use href="#s-lockup" />
            </svg>
            {" "}
          </a>
          {" "}
          <button className="nav__menu nav__menu--close" type="button" aria-label="Close menu" data-menu-close="">
            <svg className="i" aria-hidden="true">
              <use href="#i-close" />
            </svg>
          </button>
        </div>
        {" "}
        <nav aria-label="Menu">
          <ul className="menu__links">
            <li>
              <a href="#product" data-menu-link="">
                <span className="menu__ix">01</span>
                Product
              </a>
            </li>
            {" "}
            <li>
              <a href="#security" data-menu-link="">
                <span className="menu__ix">02</span>
                Security
              </a>
            </li>
            {" "}
            <li>
              <a href="#pricing" data-menu-link="">
                <span className="menu__ix">03</span>
                Pricing
              </a>
            </li>
            {" "}
            <li>
              <a href="#faq" data-menu-link="">
                <span className="menu__ix">04</span>
                Help
              </a>
            </li>
          </ul>
        </nav>
        {" "}
        <div className="menu__foot">
          <a className="btn btn--light" href="#get" data-menu-link="">
            <span className="btn__in">
              <span>Get Voltra free</span>
              <svg className="i" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </span>
          </a>
          {" "}
          <a className="btn btn--ghost" href="#get" data-menu-link="">
            <span className="btn__in">
              <span>Sign in</span>
            </span>
          </a>
        </div>
        {" "}
        <div className="menu__bloom" aria-hidden="true">
          <svg viewBox="-200 -200 400 400" focusable="false" data-bloom-glyph="menu" />
        </div>
      </div>
    </div>
  );
}
