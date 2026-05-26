/** CSS-only about visual — avoids a second WebGL canvas */
export function AboutVisual() {
  return (
    <div
      className="relative h-[320px] md:h-[420px] lg:h-[480px] w-full rounded-2xl overflow-hidden border border-[rgba(0,245,255,0.15)] bg-bg-elevated about-visual"
      aria-hidden
    >
      <div className="absolute inset-0 perspective-grid opacity-30" />
      <div className="about-visual-orb about-visual-orb--cyan" />
      <div className="about-visual-orb about-visual-orb--purple" />
      <div className="about-visual-ring" />
      <div className="about-visual-core" />
    </div>
  );
}
