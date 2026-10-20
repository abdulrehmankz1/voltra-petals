// 09 Close
export function Close() {
  return (
    <section className="close ink" id="get" aria-labelledby="close-title" data-chapter="close">
      <canvas className="close__canvas" data-scene="close" aria-hidden="true" />
      {" "}
      <div className="hz" data-hz="paper" aria-hidden="true" />
      {" "}
      <div className="wrap close__copy">
        <p className="close__eyebrow" data-close-in="">
          <svg viewBox="0 0 96 80.1164" aria-hidden="true" focusable="false">
            <use href="#s-mark" />
          </svg>
          <span className="eyebrow">Voltra</span>
        </p>
        {" "}
        <h2 className="display close__title" id="close-title" data-words="">Let your wealth bloom.</h2>
        {" "}
        <p className="lead close__lead" data-close-in="">Free to start, on mobile and web.</p>
        {" "}
        <div className="ctas ctas--center" data-close-in="">
          <a className="btn btn--light" href="#pricing" data-magnetic="">
            <span className="btn__in">
              <span>Get Voltra free</span>
              <svg className="i" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </span>
          </a>
          {" "}
          <a className="btn btn--ghost" href="#how" data-magnetic="">
            <span className="btn__in">
              <span>See how it works</span>
              <svg className="i" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </span>
          </a>
        </div>
        {" "}
        <ul className="platforms" aria-label="Platforms" data-close-in="">
          <li className="plat">
            <svg className="i" aria-hidden="true">
              <use href="#i-phone" />
            </svg>
            For iPhone
          </li>
          {" "}
          <li className="plat">
            <svg className="i" aria-hidden="true">
              <use href="#i-android" />
            </svg>
            For Android
          </li>
          {" "}
          <li className="plat">
            <svg className="i" aria-hidden="true">
              <use href="#i-globe" />
            </svg>
            On the web
          </li>
        </ul>
      </div>
    </section>
  );
}
