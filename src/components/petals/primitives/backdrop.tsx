// Decorative layers the motion layer paints. Every class and data-* attribute here is a hook for the stylesheet or
// the motion layer, so they are kept exactly as the original.

// The horizon where one ground gives way to the next; `from` is the ground of the section above (data-hz).
export function Horizon({ from }: { from: "ink" | "paper" }) {
  return <div className="hz" data-hz={from} aria-hidden="true" />;
}

// A WebGL scene (data-scene): the dawn under the hero and proof, and the close.
export function SceneCanvas({ className, scene }: { className: string; scene: "hero" | "close" }) {
  return <canvas className={className} data-scene={scene} aria-hidden="true" />;
}
