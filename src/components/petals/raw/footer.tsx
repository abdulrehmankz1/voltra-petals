// Footer
export function Footer() {
  return (
    <footer className="footer" data-chapter="footer" lang="en-GB">
      <div className="footer__bloom" aria-hidden="true">
        <svg viewBox="-300 -300 600 600" focusable="false" data-footer-bloom="" />
      </div>
      {" "}
      <div className="wrap footer__inner">
        <a className="nav__logo footer__logo" href="#top" aria-label="Voltra home" data-foot-in="">
          {" "}
          <svg className="lockup" viewBox="0 0 258.9506 60.48" aria-hidden="true" focusable="false">
            <use href="#s-lockup" />
          </svg>
          {" "}
        </a>
        {" "}
        <p className="footer__tag" data-foot-in="">Wealth that grows with you.</p>
        {" "}
        <nav aria-label="Footer" data-foot-in="">
          <ul className="footer__links">
            <li>
              <a href="#product">Product</a>
            </li>
            {" "}
            <li>
              <a href="#security">Security</a>
            </li>
            {" "}
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            {" "}
            <li>
              <a href="#faq">Help</a>
            </li>
            {" "}
            <li className="footer__sep" aria-hidden="true" />
            {" "}
            <li>
              <a className="footer__quiet" href="#privacy">Privacy</a>
            </li>
            {" "}
            <li>
              <a className="footer__quiet" href="#pricing">Terms</a>
            </li>
          </ul>
        </nav>
        {" "}
        <span className="footer__rule" aria-hidden="true" />
        {" "}
        <p className="footer__legal" data-foot-in="">
          <span>© 2026 Voltra Ltd.</span>
          {" "}
          <span>Crypto assets are volatile and their value can go down as well as up.</span>
        </p>
      </div>
    </footer>
  );
}
