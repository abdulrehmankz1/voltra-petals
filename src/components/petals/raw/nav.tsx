// Fixed header
export function Nav() {
  return (
    <header className="nav" data-nav="" lang="en-GB">
      <div className="nav__bg" aria-hidden="true" />
      {" "}
      <div className="nav__bar">
        <a className="nav__logo" href="#top" aria-label="Voltra home">
          {" "}
          <svg className="lockup" viewBox="0 0 258.9506 60.48" aria-hidden="true" focusable="false">
            <use href="#s-lockup" />
          </svg>
          {" "}
        </a>
        {" "}
        <nav className="nav__links" aria-label="Main">
          <a href="#product">Product</a>
          {" "}
          <a href="#security">Security</a>
          {" "}
          <a href="#pricing">Pricing</a>
          {" "}
          <a href="#faq">Help</a>
        </nav>
        {" "}
        <div className="nav__actions">
          <a className="nav__signin" href="#get">Sign in</a>
          {" "}
          <a className="btn btn--light btn--sm nav__cta" href="#get" data-magnetic="">
            <span className="btn__in">
              <span>
                Get Voltra
                <span className="no-xs">{" free"}</span>
              </span>
              <svg className="i no-xs" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </span>
          </a>
          {" "}
          <button className="nav__menu" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu" data-menu-open="">
            <svg className="i" aria-hidden="true">
              <use href="#i-menu" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
