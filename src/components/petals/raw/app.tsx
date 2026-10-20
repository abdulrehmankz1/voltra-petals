// 04 App
export function App() {
  return (
    <section className="app paper" aria-labelledby="app-title" data-chapter="app">
      <div className="wrap app__inner">
        <div className="app__head">
          <p className="eyebrow" data-reveal="">The app</p>
          {" "}
          <h2 className="display h2" id="app-title" data-lines="">
            <span className="line">
              <span>Numbers,</span>
            </span>
            {" "}
            <span className="line">
              <span>softly held.</span>
            </span>
          </h2>
          {" "}
          <p className="body-l" data-reveal="">Balances, keys and the next sensible move, together on one calm screen.</p>
        </div>
        {" "}
        <div className="app__stage" data-app-stage="" role="img" aria-label="The Voltra app on three phones: the home screen with a total balance of $24,860.42, the analytics screen and the Voltra AI assistant suggesting a $1,480 rebalance from ETH to BTC.">
          <div className="app__k" data-k="880x1080" aria-hidden="true">
            <div className="app__artw" data-app-artw="">
              <svg className="app__art" viewBox="0 0 880 1080" focusable="false" data-app-art="" />
            </div>
            {" "}
            {" "}
            <div className="phone-pos phone-pos--a">
              <div className="phone phone--a" data-phone="a">
                <div className="phone__body">
                  <div className="scr scr--an">
                    <div className="sbar">
                      <span>9:41</span>
                      <svg className="sbar__ic" viewBox="0 0 66 12">
                        <rect x="0" y="8" width="3" height="4" rx="1" />
                        <rect x="5" y="5.4" width="3" height="6.6" rx="1" />
                        <rect x="10" y="2.8" width="3" height="9.2" rx="1" />
                        <rect x="15" y="0" width="3" height="12" rx="1" />
                        <rect x="40.5" y=".5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".4" />
                        <rect x="42.5" y="2.5" width="16" height="7" rx="2" />
                      </svg>
                    </div>
                    {" "}
                    <svg className="an-deco" viewBox="0 0 390 440" data-an-deco="" />
                    {" "}
                    <div className="an-head">
                      <b>Analytics</b>
                      <span className="an-head__btns">
                        <span className="gbtn">
                          <svg className="i">
                            <use href="#i-sliders" />
                          </svg>
                        </span>
                        <span className="gbtn gbtn--dot">
                          <svg className="i">
                            <use href="#i-bell" />
                          </svg>
                        </span>
                      </span>
                    </div>
                    {" "}
                    <div className="bal bal--an">
                      <small>Total balance</small>
                      {" "}
                      <p className="bal__v">
                        <span data-count-money="24860">$24,860</span>
                        <span className="bal__c">.42</span>
                      </p>
                      {" "}
                      <p className="bal__d">
                        <span className="pill-up">+$1,906.21 (+8.3%)</span>
                        <span>Last 30 days</span>
                      </p>
                    </div>
                    {" "}
                    <div className="range">
                      <span>1D</span>
                      <span>1W</span>
                      <span className="on">1M</span>
                      <span>1Y</span>
                      <span>All</span>
                    </div>
                    {" "}
                    <div className="chart">
                      <svg viewBox="0 0 350 136" data-chart="a" />
                      {" "}
                      <span className="chart__pin" data-chart-pin="">
                        <svg viewBox="0 0 96 80.1164">
                          <use href="#s-mark" />
                        </svg>
                      </span>
                      {" "}
                      <div className="chart__x">
                        <span>17 Sep</span>
                        <span>2 Oct</span>
                        <span>Today</span>
                      </div>
                    </div>
                    {" "}
                    <div className="card kpis">
                      <div className="kpi">
                        <small>Health</small>
                        <b>
                          {"82 "}
                          <i>/ 100</i>
                        </b>
                        <span className="kpi__bar">
                          <i data-bar="0.82" />
                        </span>
                      </div>
                      {" "}
                      <div className="kpi">
                        <small>Today</small>
                        <b className="up">+2.4%</b>
                        <span className="kpi__sub">+$582.10</span>
                      </div>
                      {" "}
                      <div className="kpi">
                        <small>Best mover</small>
                        <b>SOL</b>
                        <span className="kpi__sub up">+3.1%</span>
                      </div>
                    </div>
                    {" "}
                    <div className="card alloc">
                      <svg className="alloc__bloom" viewBox="-40 -40 80 80" data-alloc-glyph="" />
                      {" "}
                      <div className="alloc__body">
                        <p className="alloc__h">
                          <small>Allocation</small>
                          <span>3 assets</span>
                        </p>
                        {" "}
                        <ul className="alloc__legend">
                          <li>
                            <i style={{ "--c": "#1C40DA" }} />
                            Bitcoin
                            <span>$18,204.10</span>
                            <b>73.2%</b>
                          </li>
                          {" "}
                          <li>
                            <i style={{ "--c": "#4F7DFF" }} />
                            Ethereum
                            <span>$5,120.66</span>
                            <b>20.6%</b>
                          </li>
                          {" "}
                          <li>
                            <i style={{ "--c": "#8EAEFF" }} />
                            Solana
                            <span>$1,535.66</span>
                            <b>6.2%</b>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {" "}
                    <div className="card ai-row">
                      <span className="vavatar">
                        <svg viewBox="0 0 96 80.1164">
                          <use href="#s-mark-mono" />
                        </svg>
                      </span>
                      {" "}
                      <p>
                        <small>Voltra AI</small>
                        ETH fees are 38% below average. A good window to rebalance.
                      </p>
                      {" "}
                      <span className="ai-row__go">
                        <svg className="i">
                          <use href="#i-arrow" />
                        </svg>
                      </span>
                    </div>
                    {" "}
                    <div className="tabbar">
                      <span>
                        <svg className="i">
                          <use href="#i-home" />
                        </svg>
                      </span>
                      {" "}
                      <span className="on">
                        <svg className="i">
                          <use href="#i-trend" />
                        </svg>
                      </span>
                      {" "}
                      <span className="tabbar__mark">
                        <svg viewBox="0 0 96 80.1164">
                          <use href="#s-mark-mono" />
                        </svg>
                      </span>
                      {" "}
                      <span>
                        <svg className="i">
                          <use href="#i-card" />
                        </svg>
                      </span>
                      {" "}
                      <span>
                        <svg className="i">
                          <use href="#i-apps" />
                        </svg>
                      </span>
                    </div>
                    {" "}
                    <div className="homebar" />
                  </div>
                  {" "}
                  <div className="island" />
                </div>
              </div>
            </div>
            {" "}
            {" "}
            <div className="phone-pos phone-pos--c">
              <div className="phone phone--c" data-phone="c">
                <div className="phone__body">
                  <div className="scr scr--ai">
                    <div className="sbar">
                      <span>9:41</span>
                      <svg className="sbar__ic" viewBox="0 0 66 12">
                        <rect x="0" y="8" width="3" height="4" rx="1" />
                        <rect x="5" y="5.4" width="3" height="6.6" rx="1" />
                        <rect x="10" y="2.8" width="3" height="9.2" rx="1" />
                        <rect x="15" y="0" width="3" height="12" rx="1" />
                        <rect x="40.5" y=".5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".4" />
                        <rect x="42.5" y="2.5" width="16" height="7" rx="2" />
                      </svg>
                    </div>
                    {" "}
                    <div className="ai-head">
                      <span className="gbtn">
                        <svg className="i">
                          <use href="#i-back" />
                        </svg>
                      </span>
                      {" "}
                      <span className="ai-head__id">
                        <span className="vavatar">
                          <svg viewBox="0 0 96 80.1164">
                            <use href="#s-mark-mono" />
                          </svg>
                        </span>
                        <span>
                          <b>Voltra AI</b>
                          <small>
                            <i />
                            Watching 43 networks
                          </small>
                        </span>
                      </span>
                      {" "}
                      <span className="gbtn">
                        <svg className="i">
                          <use href="#i-sliders" />
                        </svg>
                      </span>
                    </div>
                    {" "}
                    <div className="chat">
                      <p className="chat__stamp">Today 9:38</p>
                      {" "}
                      <p className="bub bub--ai" data-bubble="">Good evening, Alex. You’re up $582.10 today. Solana is your best mover at +3.1%.</p>
                      {" "}
                      <p className="bub bub--ai" data-bubble="">ETH fees are 38% below average. A good window to rebalance.</p>
                      {" "}
                      <p className="bub bub--me" data-bubble="">Am I still on plan?</p>
                      {" "}
                      <div className="bub bub--ai bub--ans" data-bubble="">
                        <p>Your ETH share is 21%, above your 15% target. Moving $1,480 to BTC brings you back on plan.</p>
                        {" "}
                        <div className="pv">
                          <p className="pv__row">
                            <span>Sell</span>
                            <b>0.4682 ETH</b>
                            <span>$1,480.00</span>
                          </p>
                          {" "}
                          <p className="pv__row">
                            <span>Buy</span>
                            <b>0.0231 BTC</b>
                            <span>$1,480.00</span>
                          </p>
                          {" "}
                          <p className="pv__after">
                            <span>After rebalancing</span>
                            <em>On plan</em>
                          </p>
                          {" "}
                          <p className="pv__bar">
                            <i style={{ "--w": "79.2" }} />
                            <i style={{ "--w": "14.6" }} />
                            <i style={{ "--w": "6.2" }} />
                          </p>
                          {" "}
                          <p className="pv__leg">
                            <span>
                              <i />
                              BTC 79.2%
                            </span>
                            <span>
                              <i />
                              ETH 14.6%
                            </span>
                            <span>
                              <i />
                              SOL 6.2%
                            </span>
                          </p>
                        </div>
                      </div>
                      {" "}
                      <p className="chips" data-bubble="">
                        <span className="chipb chipb--dark">Rebalance now</span>
                        <span className="chipb">Explain</span>
                        <span className="chipb">Remind me Friday</span>
                      </p>
                    </div>
                    {" "}
                    <div className="composer">
                      <svg className="i">
                        <use href="#i-plus" />
                      </svg>
                      <span>Ask Voltra anything</span>
                      <span className="composer__send">
                        <svg className="i">
                          <use href="#i-send" />
                        </svg>
                      </span>
                    </div>
                    {" "}
                    <div className="homebar" />
                  </div>
                  {" "}
                  <div className="island" />
                </div>
              </div>
            </div>
            {" "}
            {" "}
            <div className="phone-pos phone-pos--b">
              <div className="phone phone--b" data-phone="b">
                <div className="phone__body">
                  <div className="scr scr--home">
                    <div className="sbar">
                      <span>9:41</span>
                      <svg className="sbar__ic" viewBox="0 0 66 12">
                        <rect x="0" y="8" width="3" height="4" rx="1" />
                        <rect x="5" y="5.4" width="3" height="6.6" rx="1" />
                        <rect x="10" y="2.8" width="3" height="9.2" rx="1" />
                        <rect x="15" y="0" width="3" height="12" rx="1" />
                        <rect x="40.5" y=".5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".4" />
                        <rect x="42.5" y="2.5" width="16" height="7" rx="2" />
                      </svg>
                    </div>
                    {" "}
                    <div className="h-head">
                      <span className="avatar">AM</span>
                      {" "}
                      <span className="h-head__t">
                        <small>Good evening</small>
                        <b>Alex Morgan</b>
                      </span>
                      {" "}
                      <span className="gbtn">
                        <svg className="i">
                          <use href="#i-scan" />
                        </svg>
                      </span>
                      {" "}
                      <span className="gbtn gbtn--dot">
                        <svg className="i">
                          <use href="#i-bell" />
                        </svg>
                      </span>
                    </div>
                    {" "}
                    <div className="bal">
                      <small>Total balance</small>
                      {" "}
                      <p className="bal__v">
                        <span data-count-money="24860">$24,860</span>
                        <span className="bal__c">.42</span>
                      </p>
                      {" "}
                      <p className="bal__d">
                        <span className="pill-up">+$582.10 (2.4%)</span>
                        <span>Today</span>
                      </p>
                    </div>
                    {" "}
                    <div className="card nm" data-nm="">
                      <svg className="nm__lens" viewBox="0 0 350 120" preserveAspectRatio="none">
                        <path d="M0 30 Q150 -30 300 30 Q150 90 0 30Z" transform="rotate(-8 150 30)" fill="url(#nmLens)" />
                        <defs>
                          <linearGradient id="nmLens" x1="0" x2="1">
                            <stop offset="0" stopColor="#2F6BFF" stopOpacity=".16" />
                            <stop offset=".55" stopColor="#8EAEFF" stopOpacity=".08" />
                            <stop offset="1" stopColor="#BCD0FF" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {" "}
                      <div className="nm__top">
                        <span className="vavatar">
                          <svg viewBox="0 0 96 80.1164">
                            <use href="#s-mark-mono" />
                          </svg>
                        </span>
                        {" "}
                        <span className="nm__t">
                          <small>Voltra AI</small>
                          <b>Your next sensible move</b>
                        </span>
                        {" "}
                        <span className="nm__now">Now</span>
                      </div>
                      {" "}
                      <p className="nm__msg">Your ETH share is 21%, above your 15% target. Moving $1,480 to BTC brings you back on plan.</p>
                      {" "}
                      <div className="nm__bar">
                        <p>
                          <span>ETH share 20.6%</span>
                          <span>Target 15%</span>
                        </p>
                        {" "}
                        <span className="nm__track">
                          <i data-bar="0.206" />
                          <b />
                        </span>
                      </div>
                      {" "}
                      <p className="chips">
                        <span className="chipb chipb--dark">Rebalance now</span>
                        <span className="chipb">Explain</span>
                      </p>
                    </div>
                    {" "}
                    <div className="card keysc">
                      <span className="keysc__ic">
                        <svg className="i">
                          <use href="#i-lock" />
                        </svg>
                      </span>
                      {" "}
                      <span className="keysc__t">
                        <b>Your keys</b>
                        <small>3 shares safe · any 2 can sign</small>
                      </span>
                      {" "}
                      <span className="safe">
                        <i />
                        Safe
                      </span>
                    </div>
                    {" "}
                    <div className="card assets">
                      <p className="assets__h">
                        <b>Assets</b>
                        <span>See all</span>
                      </p>
                      {" "}
                      <p className="asset">
                        <span className="coin">
                          <svg className="i">
                            <use href="#i-btc" />
                          </svg>
                        </span>
                        <span className="asset__n">
                          <b>Bitcoin</b>
                          <small>BTC 0.2841</small>
                        </span>
                        <span className="asset__v">
                          <b>$18,204.10</b>
                          <small className="up">+1.8%</small>
                        </span>
                      </p>
                      {" "}
                      <p className="asset">
                        <span className="coin">
                          <svg className="i">
                            <use href="#i-eth" />
                          </svg>
                        </span>
                        <span className="asset__n">
                          <b>Ethereum</b>
                          <small>ETH 1.62</small>
                        </span>
                        <span className="asset__v">
                          <b>$5,120.66</b>
                          <small className="down">-0.6%</small>
                        </span>
                      </p>
                      {" "}
                      <p className="asset">
                        <span className="coin coin--s">S</span>
                        <span className="asset__n">
                          <b>Solana</b>
                          <small>SOL 12.4</small>
                        </span>
                        <span className="asset__v">
                          <b>$1,535.66</b>
                          <small className="up">+3.1%</small>
                        </span>
                      </p>
                    </div>
                    {" "}
                    <div className="tabbar">
                      <span className="on">
                        <svg className="i">
                          <use href="#i-home" />
                        </svg>
                      </span>
                      {" "}
                      <span>
                        <svg className="i">
                          <use href="#i-trend" />
                        </svg>
                      </span>
                      {" "}
                      <span className="tabbar__mark">
                        <svg viewBox="0 0 96 80.1164">
                          <use href="#s-mark-mono" />
                        </svg>
                      </span>
                      {" "}
                      <span>
                        <svg className="i">
                          <use href="#i-card" />
                        </svg>
                      </span>
                      {" "}
                      <span>
                        <svg className="i">
                          <use href="#i-apps" />
                        </svg>
                      </span>
                    </div>
                    {" "}
                    <div className="homebar" />
                  </div>
                  {" "}
                  <div className="island" />
                </div>
              </div>
            </div>
            {" "}
            <p className="keys-chip">
              <span className="keys-chip__bud">
                <svg className="i">
                  <use href="#i-lock" />
                </svg>
              </span>
              <span>
                <b>Keys secured</b>
                <small>Any two can sign</small>
              </span>
            </p>
          </div>
        </div>
        {" "}
        <ul className="benefits">
          <li className="benefit" data-reveal="">
            <span className="benefit__rule" aria-hidden="true" />
            {" "}
            <span className="ibub" aria-hidden="true">
              <svg className="i">
                <use href="#i-wallet" />
              </svg>
            </span>
            {" "}
            <div>
              <h3>One calm total</h3>
              <p>Every chain and token in one balance that moves with the market.</p>
            </div>
          </li>
          {" "}
          <li className="benefit" data-reveal="">
            <span className="benefit__rule" aria-hidden="true" />
            {" "}
            <span className="ibub" aria-hidden="true">
              <svg className="i">
                <use href="#i-lock" />
              </svg>
            </span>
            {" "}
            <div>
              <h3>Keys in view</h3>
              <p>See which key shares are ready, and recover a lost phone with the other two.</p>
            </div>
          </li>
          {" "}
          <li className="benefit" data-reveal="">
            <span className="benefit__rule" aria-hidden="true" />
            {" "}
            <span className="ibub" aria-hidden="true">
              <svg className="i">
                <use href="#i-spark" />
              </svg>
            </span>
            {" "}
            <div>
              <h3>The next sensible move</h3>
              <p>Voltra AI suggests one step at a time. Nothing moves until you approve.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
