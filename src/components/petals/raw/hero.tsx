// 01 Hero
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero__copy">
        <p className="chip" data-hero-in="">
          <span className="bud">
            <svg viewBox="0 0 96 80.1164" aria-hidden="true" focusable="false">
              <use href="#s-mark-mono" />
            </svg>
          </span>
          {" "}
          <span>Your AI-powered crypto wallet</span>
        </p>
        {" "}
        <h1 className="display h1" id="hero-title" data-lines="hero">
          <span className="line">
            <span>Wealth that</span>
          </span>
          {" "}
          <span className="line">
            <span>grows with you.</span>
          </span>
        </h1>
        {" "}
        <p className="lead hero__lead" data-hero-in="">
          Voltra watches every chain, price and key you hold, then helps your portfolio grow at a pace you can live with.
        </p>
        {" "}
        <div className="hero__space" aria-hidden="true" data-hero-space="" />
        {" "}
        <div className="ctas hero__ctas" data-hero-in="">
          <a className="btn btn--light hero__primary" href="#get" data-magnetic="">
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
      </div>
    </section>
  );
}
