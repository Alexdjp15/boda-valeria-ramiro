import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Check } from 'lucide-react';
import {
  validateRsvpSubmission,
  resolveRsvpGuestType
} from '../logic/weddingLogic.js';

/**
 * Simplified RSVP Modal Dialog (RF-6).
 * Collects guest full name, two explicit attendance buttons, and optional wishes message.
 */
export function RsvpRestaurantModal({
  isOpen,
  onClose,
  isVirtual = false,
  deadlineLabel,
  webhookUrl,
  whatsappUrl,
  whatsappPhoneDisplay,
  maxAllowedGuests = 1
}) {
  const safeMaxGuests = Math.max(
    1,
    Number.isInteger(maxAllowedGuests)
      ? maxAllowedGuests
      : parseInt(maxAllowedGuests, 10) || 1
  );
  const { effectiveIsVirtual, guestType } = resolveRsvpGuestType(
    isVirtual,
    typeof window !== 'undefined' ? window.location : ''
  );
  const dialogRef = useRef(null);
  const [fullName, setFullName] = useState('');
  const [attending, setAttending] = useState('');
  const [selectedGuestCount, setSelectedGuestCount] = useState(1);
  const [wishesMessage, setWishesMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Fallback light-dismiss for browsers without native <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e) => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    let pressedOutside = false;
    const onPointerDown = (e) => {
      pressedOutside = isOutside(e);
    };
    const onPointerUp = (e) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
    };

    dialog.addEventListener('pointerdown', onPointerDown);
    dialog.addEventListener('pointerup', onPointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown);
      dialog.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const handleSelectAttendance = (value) => {
    if (value === attending) return;
    setAttending(value);
    if (value === 'yes') {
      setSelectedGuestCount(1);
    }
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const effectiveGuestCount = attending === 'yes' ? selectedGuestCount : 0;

    const validation = validateRsvpSubmission(
      {
        fullName,
        attending,
        guestType,
        wishesMessage,
        guestCount: effectiveGuestCount
      },
      safeMaxGuests
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);

    if (webhookUrl) {
      const attendanceDisplay =
        effectiveGuestCount > 0
          ? `Sí (${effectiveGuestCount} ${effectiveGuestCount === 1 ? 'persona' : 'personas'})`
          : 'No';

      const payload = {
        fullName: validation.normalizedPayload.fullName,
        attending: validation.normalizedPayload.attending,
        attendanceText: attendanceDisplay,
        guestCount: effectiveGuestCount,
        guestType,
        isVirtual: effectiveIsVirtual,
        wishesMessage: validation.normalizedPayload.wishesMessage
      };

      setIsSubmitting(true);
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      } catch {
        // Fallback smoothly in local/offline mode or opaque CORS responses
      } finally {
        setIsSubmitting(false);
      }
    }

    setIsSubmitted(true);
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="rsvp-modal-title"
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#FAF7F2] border border-[#D4B982] shadow-2xl p-6 sm:p-8 text-[#3B3228]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar formulario"
        className="absolute top-4 right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#7E6744] hover:bg-[#EFE7DA] transition"
      >
        <X className="w-5 h-5" />
      </button>

      {isSubmitted ? (
        <div className="py-6 text-center space-y-4" role="status" aria-live="polite">
          <CheckCircle2 className="w-14 h-14 text-[#9E7B3B] mx-auto" />
          <h3 id="rsvp-modal-title" className="calligraphy-safe text-4xl">
            ¡Gracias por Confirmar!
          </h3>
          <p className="font-serif text-lg text-[#5A4B38]">
            {attending === 'yes'
              ? effectiveIsVirtual
                ? 'Hemos registrado tu asistencia a la transmisión virtual por Zoom.'
                : 'Hemos registrado tu asistencia para nuestra celebración en Santa Marta.'
              : 'Agradecemos mucho tus buenos deseos y tu respuesta.'}
          </p>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 rounded-full border border-[#9E7B3B] text-[#9E7B3B] font-sans text-xs uppercase tracking-widest hover:bg-[#9E7B3B] hover:text-white transition"
            >
              WhatsApp RSVP · {whatsappPhoneDisplay || '313 673 0779'}
            </a>
          )}
          <div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-8 py-2.5 min-h-[48px] rounded-full bg-[#9E7B3B] text-white font-sans text-xs uppercase tracking-widest hover:bg-[#7A5B24] transition"
            >
              Volver a la Invitación
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-labelledby="rsvp-modal-title">
          <div className="text-center">
            <h3 id="rsvp-modal-title" className="calligraphy-safe text-3xl sm:text-4xl">
              {effectiveIsVirtual
                ? 'Confirmar Asistencia (Transmisión Virtual)'
                : 'Confirmar Asistencia'}
            </h3>
            <p className="font-serif italic text-sm text-[#7A664B]">
              {effectiveIsVirtual
                ? `Transmisión vía Zoom · Confirmar hasta el ${deadlineLabel}`
                : `Por favor confirmar hasta el ${deadlineLabel}`}
            </p>
          </div>

          {errors.length > 0 && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs space-y-1"
            >
              {errors.map((err, idx) => (
                <p key={idx}>• {err}</p>
              ))}
            </div>
          )}

          <div>
            <label htmlFor="rsvp-fullname" className="block font-serif text-sm font-semibold mb-1.5">
              Nombre y Apellido Completo <span aria-hidden="true">*</span>
            </label>
            <input
              id="rsvp-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              autoFocus
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.length > 0) setErrors([]);
              }}
              placeholder="Ej. Valeria Albus Sánchez"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-[#D4B982] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#9E7B3B]"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="block font-serif text-sm font-semibold mb-1.5">
              {effectiveIsVirtual
                ? '¿Nos acompañarás en la transmisión virtual por Zoom?'
                : '¿Nos acompañarás en este día especial?'}{' '}
              <span aria-hidden="true">*</span>
            </legend>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                aria-pressed={attending === 'yes'}
                onClick={() => handleSelectAttendance('yes')}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl border text-left font-serif text-base flex items-center justify-between transition ${
                  attending === 'yes'
                    ? 'bg-[#9E7B3B] border-[#9E7B3B] text-white shadow-sm font-semibold'
                    : 'bg-white border-[#D4B982] text-[#3B3228] hover:bg-[#FAF4E8]'
                }`}
              >
                <span>{effectiveIsVirtual ? 'Sí, me conectaré por Zoom' : 'Sí, asistiré'}</span>
                {attending === 'yes' && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
              </button>

              <button
                type="button"
                aria-pressed={attending === 'no'}
                onClick={() => handleSelectAttendance('no')}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl border text-left font-serif text-base flex items-center justify-between transition ${
                  attending === 'no'
                    ? 'bg-[#9E7B3B] border-[#9E7B3B] text-white shadow-sm font-semibold'
                    : 'bg-white border-[#D4B982] text-[#3B3228] hover:bg-[#FAF4E8]'
                }`}
              >
                <span>
                  {effectiveIsVirtual
                    ? 'No podré conectarme, pero les deseo lo mejor'
                    : 'No podré asistir, pero les deseo lo mejor'}
                </span>
                {attending === 'no' && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
              </button>
            </div>
          </fieldset>

          {attending === 'yes' && (
            <div className="space-y-2 pt-1 text-center">
              <label
                id="guest-count-label"
                className="block font-serif italic text-xs text-[#7A664B]"
              >
                Total de personas que asistirán
              </label>
              <div
                role="group"
                aria-labelledby="guest-count-label"
                className="flex items-center justify-center gap-3"
              >
                {Array.from({ length: safeMaxGuests }, (_, i) => i + 1).map((num) => {
                  const isSelected = selectedGuestCount === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedGuestCount(num)}
                      className={`min-w-[44px] min-h-[44px] px-4 py-2 rounded-xl font-serif text-base font-semibold border transition shadow-sm flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#9E7B3B] border-[#9E7B3B] text-white'
                          : 'bg-white border-[#C8A96B] text-[#7A664B] hover:bg-[#FAF4E8]'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="rsvp-wishes" className="block font-serif text-sm font-semibold mb-1.5">
              {effectiveIsVirtual
                ? 'Felicitaciones para los novios (opcional)'
                : 'Mensaje para los novios (opcional)'}
            </label>
            <textarea
              id="rsvp-wishes"
              name="wishesMessage"
              rows={3}
              value={wishesMessage}
              onChange={(e) => setWishesMessage(e.target.value)}
              placeholder={
                effectiveIsVirtual
                  ? 'Escribe tus felicitaciones y buenos deseos para Valeria & Ramiro...'
                  : 'Escribe tus buenos deseos para Valeria & Ramiro...'
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4B982] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#9E7B3B]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] py-3 rounded-full bg-[#9E7B3B] text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-[#7A5B24] disabled:opacity-60 transition shadow-md"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Confirmación'}
          </button>
        </form>
      )}
    </dialog>
  );
}
