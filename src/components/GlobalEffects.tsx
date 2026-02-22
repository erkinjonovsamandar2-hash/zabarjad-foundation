// ── Paper Texture (SVG Noise) ─────────────────────────────────────────────────
const PaperTexture = () => {
  // High-quality seamless noise using SVG filter
  const noiseSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E`;

  return (
    <div
      className="
        fixed inset-0
        pointer-events-none
        z-[9999]
        opacity-[0.03] dark:opacity-[0.05]
      "
      style={{
        backgroundImage: `url("${noiseSVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "512px 512px",
      }}
      aria-hidden="true"
    />
  );
};

// ── Main Export ───────────────────────────────────────────────────────────────
const GlobalEffects = PaperTexture;

export default GlobalEffects;