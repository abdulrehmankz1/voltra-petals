import { keyShares, keysFigure, type KeyShare, type KeyShareGlyph, type ResponsiveText, type RichText } from "@/content/security";
import { ordinal } from "@/lib/ordinal";
import { spaced } from "@/lib/spaced";
import { MarkGlyph } from "../../brand/mark";
import { Icon } from "../../primitives/icon";

// The three key shares: the illustration the motion layer draws on its 960 x 960 canvas (data-k, data-keys-art),
// with a chip per share, then a caption per share. The figure is hidden; one sr-only line says what it shows.
export function Keys() {
  return (
    <div className="keys" data-keys="">
      <div className="keys__stage">
        <div className="keys__k" data-k="960x960">
          <svg className="keys__svg" viewBox="-480 -480 960 960" aria-hidden="true" data-keys-art="" />{" "}
          <div className="keys__fig" aria-hidden="true">
            <span className="keys__num">
              <span data-keys-count="">{keysFigure.signing}</span>
              {` of ${keysFigure.total}`}
            </span>
            <span className="eyebrow">{keysFigure.label}</span>
          </div>{" "}
          {spaced(
            keyShares,
            (share) => share.id,
            (share, index) => (
              <KeyChip id={share.id} glyph={share.glyph} number={ordinal(index)} />
            ),
          )}
        </div>
      </div>{" "}
      <p className="sr-only">{keysFigure.srText}</p>{" "}
      <ol className="kcaps">
        {spaced(
          keyShares,
          (share) => share.id,
          (share, index) => (
            <KeyCaption share={share} number={ordinal(index)} />
          ),
        )}
      </ol>
    </div>
  );
}

// A share's chip on the illustration: the colour mark, or one icon on desktop (.k-dsk) and another on mobile.
function KeyChip({ id, glyph, number }: { id: KeyShare["id"]; glyph: KeyShareGlyph; number: string }) {
  return (
    <span className={`kchip kchip--${id}`} data-n={number} aria-hidden="true">
      {glyph === "mark" ? (
        <MarkGlyph />
      ) : (
        <>
          <Icon name={glyph.desktop} className="k-dsk" />
          <Icon name={glyph.mobile} className="k-mob" />
        </>
      )}
    </span>
  );
}

function KeyCaption({ share, number }: { share: KeyShare; number: string }) {
  return (
    <li className={`kcap kcap--${share.id}`}>
      <span className="kcap__n" aria-hidden="true">
        {number}
      </span>
      <p className="kcap__state">
        <i />
        {typeof share.state === "string" ? share.state : <ShortOnXs text={share.state} />}
      </p>
      <h3>{share.title}</h3>
      <p className="no-xs">
        <Rich text={share.body.wide} />
      </p>
      <p className="xs-only">{share.body.xs}</p>
    </li>
  );
}

// Inline copy in two versions; the stylesheet shows one.
function ShortOnXs({ text }: { text: ResponsiveText }) {
  return (
    <>
      <span className="no-xs">{text.wide}</span>
      <span className="xs-only">{text.xs}</span>
    </>
  );
}

function Rich({ text }: { text: string | RichText }) {
  if (typeof text === "string") return text;
  return text.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <span key={i} className="nw">
        {part.nowrap}
      </span>
    ),
  );
}
