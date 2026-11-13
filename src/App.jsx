import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Heart,
  Wine,
  Utensils,
  Music,
  Volume2,
  VolumeX,
  Calendar,
  Video,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { weddingData } from './config/weddingData.js';
import {
  calculateCountdown,
  getInvitationModality,
  formatZoomCredentialsCopyText,
  resolveInvitationContext
} from './logic/weddingLogic.js';
import { EnvelopeIntroOverlay } from './components/EnvelopeIntroOverlay.jsx';
import { RsvpRestaurantModal } from './components/RsvpRestaurantModal.jsx';

const SCHEDULE_ICONS = {
  Heart,
  Wine,
  Utensils,
  Music,
  Video
};

function legacyCopyText(text) {
  const field = Object.assign(document.createElement('textarea'), { value: text });
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
  document.body.append(field);
  field.select();
  try {
    return document.execCommand('copy');
  } finally {
    field.remove();
  }
}

export function App() {
  const invitationContext = resolveInvitationContext(
    typeof window !== 'undefined' ? window.location : null
  );
  const { modality, maxAllowedGuests } = invitationContext;
  const isVirtual = modality === 'virtual';
  const isCeremonyOnly = modality === 'ceremony';
  const activeRsvpDeadlineLabel = isCeremonyOnly
    ? weddingData.ceremonyOnlyConfig.rsvpDeadlineLabel
    : weddingData.eventDate.rsvpDeadlineLabel;
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(weddingData.eventDate.isoTargetDate, new Date())
  );
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [ceremonyImgError, setCeremonyImgError] = useState(false);
  const [restaurantImgError, setRestaurantImgError] = useState(false);
  const [copyStatus, setCopyStatus] = useState('idle');
  const [copyMessage, setCopyMessage] = useState('');
  const audioRef = useRef(null);
  const copyTimeoutRef = useRef(null);
  const lastCopyAnnouncementRef = useRef('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(weddingData.eventDate.isoTargetDate, new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyZoomCredentials = async () => {
    const textToCopy = formatZoomCredentialsCopyText(weddingData.zoomConfig);
    if (!textToCopy) return;

    let copied = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(textToCopy);
        copied = true;
      } else {
        copied = legacyCopyText(textToCopy);
      }
    } catch {
      copied = legacyCopyText(textToCopy);
    }

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    let message = copied ? 'ID y clave copiados' : 'No se pudo copiar';
    if (message === lastCopyAnnouncementRef.current) {
      message += '\u00A0';
    }
    lastCopyAnnouncementRef.current = message;

    setCopyStatus(copied ? 'copied' : 'failed');
    setCopyMessage('');
    requestAnimationFrame(() => {
      setCopyMessage(message);
    });

    copyTimeoutRef.current = setTimeout(() => {
      setCopyStatus('idle');
      setCopyMessage('');
    }, 2200);
  };

  const scheduleItems = isVirtual
    ? weddingData.zoomConfig.scheduleItems
    : isCeremonyOnly
      ? weddingData.ceremonyOnlyConfig.scheduleItems
      : weddingData.schedule.items;

  const handleEnvelopeOpened = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => {
          // Autoplay fallback if wedding-song.mp3 is not yet placed in public/assets/
          setIsAudioPlaying(false);
        });
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => setIsAudioPlaying(false));
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F2] text-[#3B3228] overflow-x-hidden">
      {/* Background Audio Element (Replace /assets/wedding-song.mp3 anytime) */}
      <audio ref={audioRef} src={weddingData.assets.backgroundSongUrl} loop preload="none" />

      {/* Subtle Floating Music Button (Top Right) */}
      <button
        type="button"
        onClick={toggleAudioPlayback}
        aria-label={isAudioPlaying ? 'Pausar música' : 'Reproducir música'}
        className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md border border-[#D4B982] shadow-md flex items-center justify-center text-[#9E7B3B] hover:scale-105 transition"
      >
        {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Full-Screen Vertical Envelope Intro Overlay (100dvh, opens left) */}
      <EnvelopeIntroOverlay
        monogram={weddingData.couple.monogram}
        brideName={weddingData.couple.brideFullName}
        groomName={weddingData.couple.groomFullName}
        waxSealUrl={weddingData.assets.waxSealUrl}
        onEnvelopeOpened={handleEnvelopeOpened}
      />

      {/* Fixed Original Botanical Background Layer from PDF */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-no-repeat bg-cover bg-center opacity-85 mix-blend-multiply"
        style={{
          backgroundImage: `url('${weddingData.assets.floralBackgroundUrl}')`
        }}
      />

      {/* Main Mobile-First Card Container */}
      <main className="relative z-20 max-w-md mx-auto min-h-screen overflow-visible">
        {/* SECTION 1: HERO INVITATION CARD (Exact replica of physical PDF card with Zero Clipping) */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-between py-14 px-6 text-center overflow-visible">
          {/* Top Hosts Line */}
          <div className="relative z-20 pt-4 space-y-5 w-full overflow-visible">
            <p className="font-serif text-xs sm:text-sm tracking-[0.22em] uppercase text-[#5C5346]">
              {weddingData.couple.hostsLine}
            </p>
            <p className="font-serif italic text-base sm:text-lg text-[#6A5D4D]">
              {weddingData.couple.invitationIntro}
            </p>
          </div>

          {/* Center Couple Calligraphy Names (Zero Clipping Guaranteed, floating on botanical background) */}
          <div className="relative z-20 my-6 w-full flex flex-col items-center justify-center overflow-visible">
            <h1 className="calligraphy-safe text-[44px] sm:text-[52px] w-full text-center">
              {weddingData.couple.brideFullName}
            </h1>
            <span className="calligraphy-safe text-3xl sm:text-4xl my-1">
              &amp;
            </span>
            <h1 className="calligraphy-safe text-[44px] sm:text-[52px] w-full text-center">
              {weddingData.couple.groomFullName}
            </h1>
          </div>

          {/* In Memoriam, Date, Biblical Quote, and Santa Marta Location */}
          <div className="relative z-20 space-y-6 w-full pb-4 overflow-visible">
            <p className="font-serif italic text-sm sm:text-base text-[#5E5243] max-w-xs mx-auto leading-relaxed">
              {weddingData.couple.inMemoriamText}
            </p>

            <div className="py-2 border-y border-[#D4B982]/45 max-w-xs mx-auto">
              <p className="font-serif font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase text-[#4B3F30]">
                {weddingData.eventDate.fullDateLabel}
              </p>
            </div>

            <blockquote className="font-serif italic text-xs sm:text-sm text-[#665949] max-w-xs mx-auto leading-relaxed px-2">
              {weddingData.couple.biblicalQuote}{' '}
              <span className="not-italic font-semibold">
                {weddingData.couple.biblicalReference}
              </span>
            </blockquote>

            <div className="pt-2 overflow-visible">
              <p className="calligraphy-safe text-3xl sm:text-4xl">
                {weddingData.eventDate.cityLocation}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: CALENDAR DATE & COUNTDOWN (Convitly Style) */}
        <section className="relative z-20 py-14 px-6 text-center border-t border-[#E6DAC3]/60 bg-[#FAF7F2]/80 overflow-visible">
          <p className="calligraphy-safe text-4xl sm:text-5xl mb-4">Nos Casamos</p>

          <div className="max-w-xs mx-auto py-6 px-4 rounded-2xl bg-white/90 border border-[#D4B982]/50 shadow-sm space-y-2">
            <p className="font-serif font-bold text-xl tracking-[0.28em] text-[#9E7B3B]">
              {weddingData.eventDate.monthShort}
            </p>
            <p className="font-sans text-xs tracking-[0.25em] text-[#6E5D47]">
              {weddingData.eventDate.dayName}
            </p>
            <p className="font-sans font-light tracking-tight text-6xl text-[#9E7B3B] py-1">
              {weddingData.eventDate.dayNumber}
            </p>
            <p className="font-sans text-xs tracking-[0.2em] text-[#6E5D47]">
              {weddingData.eventDate.timeLabel}
            </p>
            <p className="font-serif font-bold text-xl tracking-[0.25em] text-[#9E7B3B] pt-1">
              {weddingData.eventDate.yearNumber}
            </p>
          </div>

          {isVirtual && (
            <div className="max-w-xs mx-auto mt-6 p-5 rounded-2xl bg-[#FAF7F2]/95 border border-[#D4B982] shadow-md space-y-4 text-center">
              <div className="w-11 h-11 mx-auto rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#9E7B3B] shadow-sm">
                <Video className="w-5 h-5" aria-hidden="true" />
              </div>

              <div className="space-y-1">
                <h2 className="font-serif font-bold text-xl text-[#4B3F30]">
                  {weddingData.zoomConfig.cardTitle}
                </h2>
                <p className="font-serif italic text-sm text-[#6E5D47]">
                  {weddingData.zoomConfig.title}
                </p>
              </div>

              <div className="rounded-xl bg-white/95 border border-[#E5D5B5] p-3.5 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-serif text-[#6E5D47]">ID de Reunión</span>
                  <span className="font-sans font-semibold tracking-wider text-[#3B3228]">
                    {weddingData.zoomConfig.meetingId}
                  </span>
                </div>
                <div className="border-t border-[#EFE7DA] pt-2 flex items-center justify-between gap-2">
                  <span className="font-serif text-[#6E5D47]">Código de Acceso</span>
                  <span className="font-sans font-semibold tracking-widest text-[#3B3228]">
                    {weddingData.zoomConfig.passcode}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2.5 pt-1">
                <a
                  href={weddingData.zoomConfig.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#9E7B3B] text-white font-sans text-xs uppercase tracking-[0.2em] shadow-md hover:bg-[#7A5B24] transition"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{weddingData.zoomConfig.joinButtonLabel}</span>
                </a>

                <div className="w-full flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleCopyZoomCredentials}
                    data-copied={copyStatus === 'copied' ? '' : undefined}
                    data-failed={copyStatus === 'failed' ? '' : undefined}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#9E7B3B] bg-white/80 text-[#9E7B3B] font-sans text-xs uppercase tracking-[0.16em] hover:bg-[#9E7B3B] hover:text-white transition"
                  >
                    {copyStatus === 'copied' ? (
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>{weddingData.zoomConfig.copyButtonLabel}</span>
                  </button>
                  <span
                    role="status"
                    className={`mt-1.5 text-xs font-serif italic transition-opacity duration-200 ${
                      copyStatus === 'failed' ? 'text-red-700' : 'text-[#7A5B24]'
                    } ${copyMessage ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {copyMessage || '\u00A0'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Live Countdown Grid */}
          <div className="mt-8 grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {[
              { label: 'Días', value: countdown.days },
              { label: 'Horas', value: countdown.hours },
              { label: 'Min', value: countdown.minutes },
              { label: 'Seg', value: countdown.seconds }
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl bg-white/90 border border-[#E2D3B5] shadow-sm"
              >
                <span className="block font-serif font-bold text-2xl text-[#9E7B3B]">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7A6852]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CEREMONY & RESTAURANT VENUES IN SANTA MARTA */}
        <section className="relative z-20 py-14 px-6 text-center border-t border-[#E6DAC3]/60 overflow-visible">
          <h2 className="calligraphy-safe text-4xl sm:text-5xl mb-1">
            {isVirtual || isCeremonyOnly
              ? weddingData.venues.ceremony.title
              : weddingData.venues.sectionTitle}
          </h2>
          <p className="font-serif italic text-base text-[#6E5D47] mb-10">
            {isVirtual
              ? 'Transmisión en vivo desde Zoom'
              : weddingData.venues.sectionSubtitle}
          </p>

          <div className="space-y-12">
            {/* Ceremony Card - Organic Illustration without rigid box */}
            <div className="space-y-4">
              <div className="w-full flex items-center justify-center">
                {!ceremonyImgError ? (
                  <img
                    src={weddingData.assets.ceremonyPhotoUrl}
                    alt={weddingData.venues.ceremony.title}
                    onError={() => setCeremonyImgError(true)}
                    className="w-full max-w-[320px] mx-auto object-contain drop-shadow-sm"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-white/80 border border-[#C8A96B] flex items-center justify-center text-[#9E7B3B] shadow-sm">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-serif italic text-sm text-[#7E6744]">
                      {weddingData.venues.ceremony.venueName}
                    </span>
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#9E7B3B]">
                      Santa Marta · Colombia
                    </span>
                  </div>
                )}
              </div>
              {!isVirtual && !isCeremonyOnly && (
                <h3 className="calligraphy-safe text-3xl sm:text-4xl">
                  {weddingData.venues.ceremony.title}
                </h3>
              )}
              <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#6E5D47]">
                {isVirtual ? weddingData.zoomConfig.placePretext : weddingData.venues.ceremony.placePretext}{' '}
                <strong className="font-semibold text-[#9E7B3B] block mt-1 text-sm">
                  {weddingData.venues.ceremony.venueName}
                </strong>
              </p>
              <p className="font-serif text-sm text-[#6E5D47]">
                {isVirtual
                  ? weddingData.zoomConfig.city
                  : weddingData.venues.ceremony.addressLine}
              </p>
              {!isVirtual && (
                <a
                  href={weddingData.venues.ceremony.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#9E7B3B] text-[#9E7B3B] font-sans text-xs uppercase tracking-[0.2em] hover:bg-[#9E7B3B] hover:text-white transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Abrir en Maps
                </a>
              )}
            </div>

            {/* Restaurant Reception Card - Only in Full Presencial Mode */}
            {!isVirtual && !isCeremonyOnly && (
              <div className="space-y-4 pt-4">
                <div className="w-full flex items-center justify-center">
                  {!restaurantImgError ? (
                    <img
                      src={weddingData.assets.restaurantPhotoUrl}
                      alt={weddingData.venues.reception.title}
                      onError={() => setRestaurantImgError(true)}
                      className="w-full max-w-[320px] mx-auto object-contain drop-shadow-sm"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-white/80 border border-[#C8A96B] flex items-center justify-center text-[#9E7B3B] shadow-sm">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <span className="font-serif italic text-sm text-[#7E6744]">
                        {weddingData.venues.reception.venueName}
                      </span>
                      <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#9E7B3B]">
                        Recepción &amp; Cena · Santa Marta
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="calligraphy-safe text-3xl sm:text-4xl">
                  {weddingData.venues.reception.title}
                </h3>
                <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#6E5D47]">
                  {weddingData.venues.reception.placePretext}{' '}
                  <strong className="font-semibold text-[#9E7B3B] block mt-1 text-sm">
                    {weddingData.venues.reception.venueName}
                  </strong>
                </p>
                <p className="font-serif text-sm text-[#6E5D47]">
                  {weddingData.venues.reception.addressLine} · {weddingData.venues.reception.timeLabel}
                </p>
                <a
                  href={weddingData.venues.reception.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#9E7B3B] text-[#9E7B3B] font-sans text-xs uppercase tracking-[0.2em] hover:bg-[#9E7B3B] hover:text-white transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Abrir en Maps
                </a>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: DAY SCHEDULE TIMELINE (Hidden in Ceremony-Only Mode) */}
        {!isCeremonyOnly && (
          <section className="relative z-20 py-14 px-6 text-center border-t border-[#E6DAC3]/60 bg-[#FAF7F2]/80 overflow-visible">
            <h2 className="calligraphy-safe text-4xl sm:text-5xl mb-8">
              {weddingData.schedule.sectionTitle}
            </h2>

            <div className="relative max-w-xs mx-auto space-y-6 before:absolute before:top-4 before:bottom-4 before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:bg-[#D4B982]">
              {scheduleItems.map((item) => {
                const IconComponent = SCHEDULE_ICONS[item.iconName] || Calendar;
                return (
                  <div
                    key={item.id}
                    className="relative z-10 flex flex-col items-center bg-white/95 py-3 px-5 rounded-xl border border-[#E5D5B5] shadow-sm max-w-[230px] mx-auto"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F5EFE2] border border-[#C8A96B] flex items-center justify-center text-[#9E7B3B] mb-1">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#9E7B3B]">
                      {item.time}
                    </span>
                    <span className="font-serif font-semibold text-lg text-[#3B3228]">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 5: DRESS CODE (Hidden in Virtual and Ceremony-Only Modes) */}
        {!isVirtual && !isCeremonyOnly && (
          <section className="relative z-20 py-14 px-6 text-center border-t border-[#E6DAC3]/60 bg-[#FAF7F2]/80 overflow-visible">
            <h2 className="calligraphy-safe text-4xl sm:text-5xl mb-2">
              {weddingData.dressCode.sectionTitle}
            </h2>
            <p className="font-serif italic text-base text-[#6E5D47] mb-6">
              {weddingData.dressCode.subtitle}
            </p>

            <div className="max-w-xs mx-auto p-5 rounded-2xl bg-white/95 border border-[#DEC9A4] shadow-sm space-y-1.5">
              <p className="font-serif font-semibold text-sm text-[#4A3F32]">
                {weddingData.dressCode.ladiesLabel}
              </p>
              <p className="font-serif font-semibold text-sm text-[#4A3F32]">
                {weddingData.dressCode.gentlemenLabel}
              </p>
            </div>
          </section>
        )}

        {/* SECTION 6: RSVP CONFIRMATION & SIGNATURE FOOTER */}
        <section className="relative z-20 py-16 px-6 text-center border-t border-[#E6DAC3]/60 overflow-visible">
          {!isVirtual && (
            <>
              <h2 className="calligraphy-safe text-4xl sm:text-5xl mb-2">
                Confirma tu Asistencia
              </h2>
              <p className="font-serif italic text-base text-[#6E5D47] mb-6">
                Hasta el {activeRsvpDeadlineLabel}
              </p>

              <div className="flex flex-col items-center gap-3 mb-12">
                <button
                  type="button"
                  onClick={() => setIsRsvpOpen(true)}
                  className="px-10 py-3.5 rounded-full bg-[#9E7B3B] text-white font-sans text-xs uppercase tracking-[0.25em] shadow-lg hover:bg-[#7A5B24] transition"
                >
                  Confirmar Asistencia
                </button>

                <a
                  href={weddingData.rsvp.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full border border-[#9E7B3B] text-[#9E7B3B] font-sans text-xs uppercase tracking-[0.18em] hover:bg-[#9E7B3B] hover:text-white transition"
                >
                  WhatsApp · {weddingData.rsvp.whatsappPhoneDisplay}
                </a>
              </div>
            </>
          )}

          <div
            className={`${!isVirtual ? 'pt-6 border-t border-[#E6DAC3]/50' : ''} space-y-2 overflow-visible`}
          >
            <p className="calligraphy-safe text-3xl">
              {weddingData.couple.brideFullName.split(' ')[0]} &amp;{' '}
              {weddingData.couple.groomFullName.split(' ')[0]}
            </p>
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#8A775F]">
              11 · Diciembre · 2026 — Santa Marta
            </p>
          </div>
        </section>
      </main>

      {/* RSVP Modal */}
      {!isVirtual && (
        <RsvpRestaurantModal
          isOpen={isRsvpOpen}
          onClose={() => setIsRsvpOpen(false)}
          deadlineLabel={activeRsvpDeadlineLabel}
          webhookUrl={weddingData.rsvp.googleAppsScriptWebhookUrl}
          whatsappUrl={weddingData.rsvp.whatsappUrl}
          whatsappPhoneDisplay={weddingData.rsvp.whatsappPhoneDisplay}
          isVirtual={isVirtual}
          maxAllowedGuests={invitationContext.maxAllowedGuests}
        />
      )}
    </div>
  );
}

export default App;
