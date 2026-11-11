import React, { useState } from 'react';

/**
 * Full-Screen Vertical Envelope Overlay (RF-1).
 * - Occupies 100vw x 100dvh on mobile devices without horizontal overflow.
 * - Linen/ivory paper gradient (`bg-gradient-to-b from-[#FAF7F2] via-[#EFEAE1] to-[#E3DCD0]`)
 *   and vertical flap seam (`border-r border-[#C8BFB0]/60`).
 * - Physical Wax Seal image (`/assets/wax-seal-real.png`) with realistic drop-shadow
 *   and tactile micro-animation (`hover:scale-105 active:scale-95`).
 * - Gatefold/book opening to the left (`rotateY(-165deg)`, `2200ms`, `cubic-bezier(0.22, 1, 0.36, 1)`).
 */
export function EnvelopeIntroOverlay({
  monogram,
  brideName,
  groomName,
  waxSealUrl = '/assets/wax-seal-real.png',
  onEnvelopeOpened
}) {
  const [isOpening, setIsOpening] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [sealImgSrc, setSealImgSrc] = useState(waxSealUrl);

  if (isDismissed) {
    return null;
  }

  const handleSealClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    if (typeof onEnvelopeOpened === 'function') {
      onEnvelopeOpened();
    }
    setTimeout(() => {
      setIsDismissed(true);
    }, 2250);
  };

  const handleSealImageError = () => {
    if (sealImgSrc.endsWith('.png')) {
      setSealImgSrc('/assets/wax-seal-real.jpg');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden select-none envelope-perspective transition-opacity duration-700 ${
        isOpening ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      aria-label="Sobre de invitación vertical"
    >
      {/* Base interior shadow layer visible as the vertical flap swings left */}
      <div
        className={`absolute inset-0 bg-[#EFEAE1] transition-opacity duration-1000 ${
          isOpening ? 'opacity-0 delay-1000' : 'opacity-100'
        }`}
      />

      {/* Full-Screen Vertical Envelope Door / Flap opening slowly to the LEFT */}
      <div
        className={`relative w-full h-full flex flex-col items-center justify-between py-12 px-6 bg-gradient-to-b from-[#FAF7F2] via-[#EFEAE1] to-[#E3DCD0] border-r border-[#C8BFB0]/60 shadow-2xl envelope-flap-left ${
          isOpening ? 'is-open opacity-0' : ''
        }`}
      >
        {/* Subtle vertical paper grain and inner gold border frame */}
        <div className="pointer-events-none absolute inset-4 sm:inset-7 border border-[#C5A567]/40 rounded-sm" />
        <div className="pointer-events-none absolute inset-6 sm:inset-9 border border-[#C5A567]/20 rounded-sm" />

        {/* Subtle lateral flap union crease line */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-r border-[#C8BFB0]/60" />

        {/* Top Header Label */}
        <div className="relative z-10 text-center pt-4">
          <p className="font-serif text-xs sm:text-sm tracking-[0.3em] uppercase text-[#7E6744]">
            Invitación Exclusiva
          </p>
        </div>

        {/* Center Physical Wax Seal Button (Strictly Centered on Vertical Axis, Only Italic Prompt Below) */}
        <div className="relative z-20 flex flex-col items-center justify-center my-auto">
          <button
            type="button"
            onClick={handleSealClick}
            aria-label="Toca el sello para abrir"
            className="group relative flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-full focus:outline-none transition-transform duration-500 hover:scale-105 active:scale-95"
          >
            <img
              src={sealImgSrc}
              alt={`Sello de lacre ${monogram}`}
              onError={handleSealImageError}
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-full wax-seal-shadow select-none pointer-events-none"
              style={{
                filter: 'drop-shadow(0 12px 24px rgba(60, 45, 20, 0.45))'
              }}
            />
          </button>

          {/* Underneath the seal keep ONLY the italic text: "Toca el sello para abrir" */}
          <span className="mt-6 font-serif italic text-base sm:text-lg text-[#6E5634] tracking-widest animate-pulse">
            Toca el sello para abrir
          </span>
        </div>

        {/* Bottom Couple Preview */}
        <div className="relative z-10 text-center pb-4">
          <p className="font-serif text-xs sm:text-sm uppercase tracking-[0.25em] text-[#8B734B]">
            {brideName.split(' ')[0]} &amp; {groomName.split(' ')[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
