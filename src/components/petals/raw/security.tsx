// 05 Security
export function Security() {
  return (
    <section className="security ink" id="security" aria-labelledby="security-title" data-chapter="security">
      <div className="hz" data-hz="paper" aria-hidden="true" />
      {" "}
      <div className="wrap security__inner" id="privacy">
        <div className="security__copy">
          <p className="eyebrow" data-reveal="">Security</p>
          {" "}
          <h2 className="display h2" id="security-title" data-lines="">
            <span className="line">
              <span>Three keys.</span>
            </span>
            {" "}
            <span className="line">
              <span>One quiet promise.</span>
            </span>
          </h2>
          {" "}
          <p className="body-l" data-reveal="">
            Your phone, your recovery kit and the Voltra guardian each hold one share. Any two can sign; none can move funds alone.
          </p>
          {" "}
          <p className="chip chip--note no-xs" data-reveal="">
            <span className="bud">
              <svg className="i" aria-hidden="true">
                <use href="#i-lock" />
              </svg>
            </span>
            {" "}
            <span>Self-custody by design. You hold your keys.</span>
          </p>
        </div>
        {" "}
        <div className="keys" data-keys="">
          <div className="keys__stage">
            <div className="keys__k" data-k="960x960">
              <svg className="keys__svg" viewBox="-480 -480 960 960" aria-hidden="true" data-keys-art="" />
              {" "}
              <div className="keys__fig" aria-hidden="true">
                <span className="keys__num">
                  <span data-keys-count="">2</span>
                  {" of 3"}
                </span>
                <span className="eyebrow">Keys to sign</span>
              </div>
              {" "}
              <span className="kchip kchip--phone" data-n="01" aria-hidden="true">
                <svg className="i k-dsk">
                  <use href="#i-phone" />
                </svg>
                <svg className="i k-mob">
                  <use href="#i-scan" />
                </svg>
              </span>
              {" "}
              <span className="kchip kchip--guard" data-n="02" aria-hidden="true">
                <svg viewBox="0 0 96 80.1164">
                  <use href="#s-mark" />
                </svg>
              </span>
              {" "}
              <span className="kchip kchip--kit" data-n="03" aria-hidden="true">
                <svg className="i k-dsk">
                  <use href="#i-cloud" />
                </svg>
                <svg className="i k-mob">
                  <use href="#i-lock" />
                </svg>
              </span>
            </div>
          </div>
          {" "}
          <p className="sr-only">Two of three keys are needed to sign.</p>
          {" "}
          <ol className="kcaps">
            <li className="kcap kcap--phone">
              <span className="kcap__n" aria-hidden="true">01</span>
              <p className="kcap__state">
                <i />
                Signing
              </p>
              <h3>Your phone</h3>
              <p className="no-xs">Signs on your device, with your face or fingerprint.</p>
              <p className="xs-only">One share lives on your phone, unlocked by your face or fingerprint.</p>
            </li>
            {" "}
            <li className="kcap kcap--guard">
              <span className="kcap__n" aria-hidden="true">02</span>
              <p className="kcap__state">
                <i />
                Signing
              </p>
              <h3>Voltra guardian</h3>
              <p className="no-xs">
                {"Checks every request and "}
                <span className="nw">co-signs</span>
                {" what you approve."}
              </p>
              <p className="xs-only">A second share co-signs each move once it passes a risk check.</p>
            </li>
            {" "}
            <li className="kcap kcap--kit">
              <span className="kcap__n" aria-hidden="true">03</span>
              <p className="kcap__state">
                <i />
                <span className="no-xs">In reserve</span>
                <span className="xs-only">Standby</span>
              </p>
              <h3>Recovery kit</h3>
              <p className="no-xs">Rests encrypted in your own cloud, ready if you need it.</p>
              <p className="xs-only">The third rests in your own cloud, ready if your phone is lost.</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
