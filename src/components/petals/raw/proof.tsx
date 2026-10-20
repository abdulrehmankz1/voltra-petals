// 02 Proof
export function Proof() {
  return (
    <section className="proof" aria-labelledby="proof-title" data-chapter="proof">
      <div className="proof__hz" aria-hidden="true" data-proof-hz="" />
      {" "}
      <div className="wrap proof__grid">
        <h2 className="eyebrow proof__label" id="proof-title" data-reveal="">Trusted at scale</h2>
        {" "}
        <ul className="stats">
          <li className="stat" data-reveal="">
            <span className="stat__num" aria-hidden="true">
              <span className="stat__size">1.8M</span>
              <span className="stat__val" data-count="1.8" data-decimals="1" data-suffix="M">1.8M</span>
            </span>
            {" "}
            <span className="sr-only">1.8M</span>
            {" "}
            <span className="stat__cap">wallets created</span>
          </li>
          {" "}
          <li className="stat" data-reveal="">
            <span className="stat__num" aria-hidden="true">
              <span className="stat__size">$6.2B</span>
              <span className="stat__val" data-count="6.2" data-decimals="1" data-prefix="$" data-suffix="B">$6.2B</span>
            </span>
            {" "}
            <span className="sr-only">$6.2B</span>
            {" "}
            <span className="stat__cap">in assets secured</span>
          </li>
          {" "}
          <li className="stat" data-reveal="">
            <span className="stat__num" aria-hidden="true">
              <span className="stat__size">43</span>
              <span className="stat__val" data-count="43" data-decimals="0">43</span>
            </span>
            {" "}
            <span className="sr-only">43</span>
            {" "}
            <span className="stat__cap">networks in one view</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
