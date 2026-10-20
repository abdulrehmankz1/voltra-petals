// 07 Pricing
export function Plans() {
  return (
    <section className="pricing paper" id="pricing" aria-labelledby="pricing-title" data-chapter="pricing">
      <svg className="pricing__art" aria-hidden="true" data-pricing-art="" />
      {" "}
      <div className="wrap">
        <div className="pricing__head">
          <div className="pricing__intro">
            <p className="eyebrow" data-reveal="">Pricing</p>
            {" "}
            <h2 className="display h2" id="pricing-title" data-lines="">
              <span className="line">
                <span>Room to grow.</span>
              </span>
            </h2>
            {" "}
            <p className="body-l" data-reveal="">Start free and upgrade when your portfolio asks for more.</p>
          </div>
          {" "}
          <div className="pricing__aside" data-reveal="">
            <fieldset className="billing" data-billing="">
              {" "}
              <legend className="sr-only">Billing period</legend>
              {" "}
              <label className="billing__opt">
                <input type="radio" name="billing" value="m" defaultChecked />
                <span>Monthly</span>
              </label>
              {" "}
              <label className="billing__opt">
                <input type="radio" name="billing" value="y" />
                <span>Yearly</span>
              </label>
              {" "}
              <span className="billing__thumb" aria-hidden="true" />
              {" "}
            </fieldset>
            {" "}
            <p className="pricing__note">
              <span data-billing-note="" data-m="Pay yearly and get two months free." data-y="Two months free on Plus and Pro." aria-live="polite">Pay yearly and get two months free.</span>
            </p>
            {" "}
            <a className="link no-xs" href="#plans">
              {"Compare plans "}
              <svg className="i" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </a>
          </div>
        </div>
        {" "}
        <div className="plans" id="plans" data-plans="">
          <article className="plan plan--free" aria-labelledby="plan-free">
            <div className="plan__top">
              <div className="plan__id">
                <svg className="plan__glyph" viewBox="0 0 48 48" aria-hidden="true" data-plan-glyph="bud" />
                {" "}
                <div>
                  <h3 id="plan-free">Free</h3>
                  <p>For getting started</p>
                </div>
              </div>
              {" "}
              <p className="price">
                <span className="price__amt">
                  <span className="price__cur">$</span>
                  <span className="price__num" data-m="0" data-y="0">0</span>
                </span>
                <span className="price__per" data-m="per month" data-y="per month">per month</span>
              </p>
              {" "}
              <span className="plan__rule" aria-hidden="true" />
              {" "}
              <ul className="ticks">
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Wallet for 43 networks
                </li>
                {" "}
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Five price alerts
                </li>
                {" "}
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Weekly AI summary
                </li>
              </ul>
            </div>
            {" "}
            <a className="btn btn--volt btn--block" href="#get" data-magnetic="">
              <span className="btn__in">
                <span>Get Voltra free</span>
                <svg className="i" aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </span>
            </a>
          </article>
          {" "}
          <article className="plan plan--plus" aria-labelledby="plan-plus">
            <div className="plan__tex" aria-hidden="true">
              <svg viewBox="0 0 432 568" preserveAspectRatio="xMaxYMax slice" data-plus-petal="" />
              <svg className="plan__mark" viewBox="0 0 260 170" data-plus-mark="" />
            </div>
            {" "}
            <div className="plan__top">
              <p className="badge">
                <i />
                Most chosen
              </p>
              {" "}
              <div className="plan__id">
                <span className="plan__glyph plan__glyph--mark" aria-hidden="true">
                  <svg viewBox="0 0 96 80.1164">
                    <use href="#s-mark-mono" />
                  </svg>
                </span>
                {" "}
                <div>
                  <h3 id="plan-plus">Plus</h3>
                  <p>For active investors</p>
                </div>
              </div>
              {" "}
              <p className="price">
                <span className="price__amt">
                  <span className="price__cur">$</span>
                  <span className="price__num" data-m="6" data-y="5">6</span>
                </span>
                <span className="price__per" data-m="per month" data-y="per month, billed yearly">per month</span>
              </p>
              {" "}
              <span className="plan__rule" aria-hidden="true" />
              {" "}
              <ul className="ticks">
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Daily AI insights and nudges
                </li>
                {" "}
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Unlimited alerts
                </li>
                {" "}
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Swap fees from 0.25%
                </li>
              </ul>
            </div>
            {" "}
            <a className="btn btn--light btn--block" href="#get" data-magnetic="">
              <span className="btn__in">
                <span>Try Plus free for 30 days</span>
                <svg className="i" aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </span>
            </a>
          </article>
          {" "}
          <article className="plan plan--pro" aria-labelledby="plan-pro">
            <div className="plan__top">
              <div className="plan__id">
                <svg className="plan__glyph" viewBox="0 0 48 48" aria-hidden="true" data-plan-glyph="bloom" />
                {" "}
                <div>
                  <h3 id="plan-pro">Pro</h3>
                  <p>For serious portfolios</p>
                </div>
              </div>
              {" "}
              <p className="price">
                <span className="price__amt">
                  <span className="price__cur">$</span>
                  <span className="price__num" data-m="18" data-y="15">18</span>
                </span>
                <span className="price__per" data-m="per month" data-y="per month, billed yearly">per month</span>
              </p>
              {" "}
              <span className="plan__rule" aria-hidden="true" />
              {" "}
              <ul className="ticks">
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Tax reports in one click
                </li>
                {" "}
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Risk score and stress tests
                </li>
                {" "}
                <li>
                  <svg className="i" aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Priority human support
                </li>
              </ul>
            </div>
            {" "}
            <a className="btn btn--volt btn--block" href="#get" data-magnetic="">
              <span className="btn__in">
                <span>Choose Pro</span>
                <svg className="i" aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </span>
            </a>
          </article>
        </div>
        {" "}
        <p className="pricing__more xs-only">
          <a className="link" href="#plans">
            {"Compare plans "}
            <svg className="i" aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
        </p>
      </div>
    </section>
  );
}
