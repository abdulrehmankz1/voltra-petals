// 08 FAQ
export function Faq() {
  return (
    <section className="faq paper" id="faq" aria-labelledby="faq-title" data-chapter="faq">
      <div className="wrap faq__grid">
        <div className="faq__head">
          <p className="eyebrow" data-reveal="">Questions</p>
          {" "}
          <h2 className="display h2" id="faq-title" data-lines="">
            <span className="line">
              <span>Questions,</span>
            </span>
            {" "}
            <span className="line">
              <span>answered.</span>
            </span>
          </h2>
          {" "}
          <div className="faq__lens" aria-hidden="true" data-lens="" />
        </div>
        {" "}
        <div className="qas" data-faq="">
          <div className="qa is-open">
            <span className="qa__bg" aria-hidden="true" />
            {" "}
            <h3 className="qa__h">
              <button className="qa__btn" type="button" id="qa1-b" aria-expanded="true" aria-controls="qa1">
                <span className="qa__ix">01</span>
                <span className="qa__q">Is Voltra a custodial wallet?</span>
                <span className="qa__tog" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </h3>
            {" "}
            <div className="qa__panel" id="qa1" role="region" aria-labelledby="qa1-b">
              <p>
                No. You hold your keys. Voltra splits them into three shares so you can recover your wallet if you lose your phone, and it can never move funds on its own.
              </p>
            </div>
          </div>
          {" "}
          <div className="qa">
            <span className="qa__bg" aria-hidden="true" />
            {" "}
            <h3 className="qa__h">
              <button className="qa__btn" type="button" id="qa2-b" aria-expanded="false" aria-controls="qa2">
                <span className="qa__ix">02</span>
                <span className="qa__q">Which networks does Voltra support?</span>
                <span className="qa__tog" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </h3>
            {" "}
            <div className="qa__panel" id="qa2" role="region" aria-labelledby="qa2-b" hidden>
              <p>43 networks today, including Bitcoin, Ethereum, Solana, Base and Arbitrum, with more every month.</p>
            </div>
          </div>
          {" "}
          <div className="qa">
            <span className="qa__bg" aria-hidden="true" />
            {" "}
            <h3 className="qa__h">
              <button className="qa__btn" type="button" id="qa3-b" aria-expanded="false" aria-controls="qa3">
                <span className="qa__ix">03</span>
                <span className="qa__q">How does Voltra AI use my data?</span>
                <span className="qa__tog" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </h3>
            {" "}
            <div className="qa__panel" id="qa3" role="region" aria-labelledby="qa3-b" hidden>
              <p>
                Voltra AI reads public market data and your on-device portfolio. Your keys and personal data never train a model.
              </p>
            </div>
          </div>
          {" "}
          <div className="qa">
            <span className="qa__bg" aria-hidden="true" />
            {" "}
            <h3 className="qa__h">
              <button className="qa__btn" type="button" id="qa4-b" aria-expanded="false" aria-controls="qa4">
                <span className="qa__ix">04</span>
                <span className="qa__q">What does Voltra cost?</span>
                <span className="qa__tog" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </h3>
            {" "}
            <div className="qa__panel" id="qa4" role="region" aria-labelledby="qa4-b" hidden>
              <p>Voltra is free to start. Plus is $6 a month and Pro is $18 a month.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
