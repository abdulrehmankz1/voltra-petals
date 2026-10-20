import { ICON_ARTWORK, ICON_NAMES, iconId, type IconArtwork, type IconShape, type Pen } from "./icon-artwork";
import { LOCKUP, MARK, MARK_GRADIENTS, WORDMARK, viewBoxOf } from "./mark-geometry";

const href = (id: string) => `#${id}`;

// The inline sprite every <use> on the page points at: the colour and mono marks, the wordmark, the lockup that
// composes them and the icons (#i-*).
export function Sprite() {
  return (
    <svg className="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {MARK_GRADIENTS.map(({ id, from, to, ...line }) => (
          <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" {...line}>
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        ))}
      </defs>
      <symbol id={MARK.id} viewBox={viewBoxOf(MARK.box)}>
        {MARK.petals.map((petal, i) => (
          <path key={petal.name} transform={`translate(${petal.x} 0)`} fill={`url(#${MARK_GRADIENTS[i].id})`} d={petal.d} />
        ))}
      </symbol>
      <symbol id={MARK.monoId} viewBox={viewBoxOf(MARK.box)}>
        {MARK.petals.map((petal) => (
          <path key={petal.name} transform={`translate(${petal.x} 0)`} fill="currentColor" d={petal.d} />
        ))}
      </symbol>
      <symbol id={WORDMARK.id} viewBox={viewBoxOf(WORDMARK.box)}>
        <g fill="currentColor">
          {WORDMARK.letters.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </symbol>
      <symbol id={LOCKUP.id} viewBox={viewBoxOf(LOCKUP.box)}>
        <use href={href(MARK.id)} width={LOCKUP.mark.w} height={LOCKUP.mark.h} />
        <use
          href={href(WORDMARK.id)}
          x={LOCKUP.wordmark.x}
          y={LOCKUP.wordmark.y}
          width={WORDMARK.box.w}
          height={WORDMARK.box.h}
        />
      </symbol>
      {ICON_NAMES.map((name) => (
        <symbol key={name} id={iconId(name)} viewBox="0 0 24 24">
          <IconPaths artwork={ICON_ARTWORK[name]} />
        </symbol>
      ))}
    </svg>
  );
}

// The pen as SVG presentation attributes; caps and joins are left at the default unless the icon rounds them.
function penProps({ width, cap, join }: Pen) {
  return {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: width,
    strokeLinecap: cap ? ("round" as const) : undefined,
    strokeLinejoin: join ? ("round" as const) : undefined,
  };
}

function IconPaths({ artwork }: { artwork: IconArtwork }) {
  if ("d" in artwork) return <path d={artwork.d} {...penProps(artwork.pen)} />;
  return (
    <>
      <g {...penProps(artwork.pen)}>
        {artwork.group.map((shape, i) => (
          <Shape key={i} shape={shape} />
        ))}
      </g>
      {artwork.dot && <circle {...artwork.dot} fill="currentColor" />}
    </>
  );
}

function Shape({ shape }: { shape: IconShape }) {
  if ("d" in shape) return <path d={shape.d} strokeLinecap={shape.cap ? "round" : undefined} />;
  if ("rect" in shape) return <rect {...shape.rect} />;
  if ("circle" in shape) return <circle {...shape.circle} />;
  return <ellipse {...shape.ellipse} />;
}
