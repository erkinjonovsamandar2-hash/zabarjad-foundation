// ── Paper Texture (SVG Noise) ─────────────────────────────────────────────────
// FIX: REMOVED. SVG <feTurbulence> spread across `fixed inset-0` forces the 
// browser's compositor to repaint the entire screen on every scroll pixel.
// This was destroying the framerate and causing extreme scroll stoppage.
const GlobalEffects = () => {
  return null;
};

export default GlobalEffects;