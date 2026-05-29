/**
 * Fixed CSS cinematic backdrop — no WebGL, no RAF.
 * Renders immediately with solid fallback; drift animates only when allowed.
 */
export function CinematicBackground() {
  return (
    <div className="cinematic-bg" aria-hidden>
      <div className="cinematic-bg__base" />
      <div className="cinematic-bg__glow cinematic-bg__glow--tl" />
      <div className="cinematic-bg__glow cinematic-bg__glow--right" />
      <div className="cinematic-bg__glow cinematic-bg__glow--bl" />
      <div className="cinematic-bg__vignette" />
      <div className="cinematic-bg__noise" />
    </div>
  );
}
