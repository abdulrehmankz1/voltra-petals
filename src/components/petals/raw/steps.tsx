// 06 How it works
export function Steps() {
  return (
    <section className="how paper" id="how" aria-labelledby="how-title" data-chapter="how">
      <div className="how__pin" data-how-pin="">
        <div className="hz" data-hz="ink" aria-hidden="true" />
        {" "}
        <svg className="how__art" aria-hidden="true" data-how-art="" />
        {" "}
        <div className="wrap how__head">
          <p className="eyebrow" data-reveal="">How it works</p>
          {" "}
          <h2 className="display h2" id="how-title" data-lines="">
            <span className="line">
              <span>Plant it.</span>
            </span>
            {" "}
            <span className="line">
              <span>Watch it grow.</span>
            </span>
          </h2>
        </div>
        {" "}
        <ol className="steps" data-steps="">
          <li className="step" data-step="0">
            <span className="step__ix">
              <span className="m-only">{"Step "}</span>
              01
            </span>
            <h3>Create your wallet</h3>
            <p>Under two minutes, with your key split from the start.</p>
          </li>
          {" "}
          <li className="step" data-step="1">
            <span className="step__ix">
              <span className="m-only">{"Step "}</span>
              02
            </span>
            <h3>Bring your assets</h3>
            <p>Connect the wallets you already use, or buy with a card.</p>
          </li>
          {" "}
          <li className="step" data-step="2">
            <span className="step__ix">
              <span className="m-only">{"Step "}</span>
              03
            </span>
            <h3>Let Voltra tend it</h3>
            <p>Set targets and alerts. Voltra suggests the next move and you approve every one.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
