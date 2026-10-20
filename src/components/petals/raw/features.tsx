// 03 Features
export function Features() {
  return (
    <section className="features paper" id="product" aria-labelledby="features-title" data-chapter="features">
      <div className="hz" data-hz="ink" aria-hidden="true" />
      {" "}
      <div className="wrap features__inner">
        <div className="features__head">
          <p className="eyebrow" data-reveal="">Voltra AI</p>
          {" "}
          <h2 className="display h2" id="features-title" data-lines="">
            <span className="line">
              <span>Calm intelligence,</span>
            </span>
            {" "}
            <span className="line">
              <span>in full bloom.</span>
            </span>
          </h2>
          {" "}
          <p className="body-l" data-reveal="">Voltra AI reads prices, fees and on-chain activity around the clock, then speaks plainly.</p>
        </div>
        {" "}
        <div className="features__art" aria-hidden="true" data-features-art="" />
        {" "}
        <ol className="flist" data-flist="">
          <li className="flist__item is-active" data-feature="0">
            <span className="flist__rule" aria-hidden="true" />
            {" "}
            <span className="flist__ix">01</span>
            {" "}
            <div className="flist__txt">
              <h3>Insight</h3>
              <p>Plain-language nudges when something matters.</p>
            </div>
            {" "}
            <svg className="flist__key" viewBox="-17 -17 34 34" aria-hidden="true" data-key-glyph="0" />
          </li>
          {" "}
          <li className="flist__item" data-feature="1">
            <span className="flist__rule" aria-hidden="true" />
            {" "}
            <span className="flist__ix">02</span>
            {" "}
            <div className="flist__txt">
              <h3>Security</h3>
              <p>Your key, split three ways. Any two can sign.</p>
            </div>
            {" "}
            <svg className="flist__key" viewBox="-17 -17 34 34" aria-hidden="true" data-key-glyph="1" />
          </li>
          {" "}
          <li className="flist__item" data-feature="2">
            <span className="flist__rule" aria-hidden="true" />
            {" "}
            <span className="flist__ix">03</span>
            {" "}
            <div className="flist__txt">
              <h3>Every chain</h3>
              <p>Bitcoin, Ethereum, Solana and 40 more, side by side.</p>
            </div>
            {" "}
            <svg className="flist__key" viewBox="-17 -17 34 34" aria-hidden="true" data-key-glyph="2" />
          </li>
          {" "}
          <li className="flist__item" data-feature="3">
            <span className="flist__rule" aria-hidden="true" />
            {" "}
            <span className="flist__ix">04</span>
            {" "}
            <div className="flist__txt">
              <h3>Fair swaps</h3>
              <p>The best route and the full cost, before you confirm.</p>
            </div>
            {" "}
            <svg className="flist__key" viewBox="-17 -17 34 34" aria-hidden="true" data-key-glyph="3" />
          </li>
        </ol>
      </div>
    </section>
  );
}
