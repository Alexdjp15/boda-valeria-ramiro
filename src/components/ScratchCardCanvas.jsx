import React, { useRef, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { calculateScratchPercentage } from '../logic/weddingLogic.js';

/**
 * Interactive HTML5 Canvas Scratch-to-Reveal Card (RF-5).
 */
export function ScratchCardCanvas({ sectionTitle, instructionText, giftTitle, giftMessage }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Paint metallic gold foil surface
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#DFC488');
    gradient.addColorStop(0.35, '#C49C4E');
    gradient.addColorStop(0.65, '#E8D29C');
    gradient.addColorStop(1, '#A67D34');

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative inner border on foil
    ctx.strokeStyle = 'rgba(255, 250, 235, 0.65)';
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Foil instruction text
    ctx.fillStyle = '#4B3614';
    ctx.font = '600 16px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ RASPA AQUÍ CON TU DEDO ✦', width / 2, height / 2 - 6);
    ctx.font = 'italic 14px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Para descubrir nuestro detalle especial', width / 2, height / 2 + 18);
  }, []);

  const scratchAtPoint = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pct = calculateScratchPercentage(imageData.data);
    if (pct >= 45) {
      setIsRevealed(true);
    }
  };

  const handlePointerDown = (e) => {
    setIsDrawing(true);
    scratchAtPoint(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    scratchAtPoint(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  return (
    <section className="relative z-20 py-14 px-5 max-w-lg mx-auto text-center">
      <h2 className="calligraphy-safe text-4xl sm:text-5xl mb-2">{sectionTitle}</h2>
      <p className="font-serif italic text-base sm:text-lg text-[#6A5A44] mb-6 px-2">
        {instructionText}
      </p>

      <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg border border-[#D4B982]/60 bg-[#FAF7F2]/95 p-6 min-h-[210px] flex flex-col items-center justify-center">
        {/* Revealed Content Underneath */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-3 py-2">
          <div className="w-11 h-11 rounded-full bg-[#F3E9D6] border border-[#C8A96B] flex items-center justify-center mb-3 text-[#9E7B3B]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-semibold text-2xl text-[#8A682D] tracking-wide mb-2">
            {giftTitle}
          </h3>
          <p className="font-serif text-base sm:text-lg text-[#4A3F32] leading-relaxed">
            {giftMessage}
          </p>
        </div>

        {/* Interactive Gold Scratch Foil Layer */}
        <canvas
          ref={canvasRef}
          width={420}
          height={220}
          role="button"
          aria-label="Raspa para revelar el detalle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`
            absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-700 z-20
            ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        />
      </div>
    </section>
  );
}
