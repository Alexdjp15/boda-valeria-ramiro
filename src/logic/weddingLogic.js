/**
 * Pure domain logic functions for the Wedding Invitation SDD architecture.
 * Zero DOM or browser storage dependencies so they can be verified with `node --test`.
 */

/**
 * Calculates remaining days, hours, minutes, and seconds from currentDate to targetIsoDate.
 * @param {string|Date} targetIsoDate
 * @param {string|Date} currentDate
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, isPast: boolean }}
 */
export function calculateCountdown(targetIsoDate, currentDate) {
  const targetMs = new Date(targetIsoDate).getTime();
  const currentMs = new Date(currentDate).getTime();

  if (Number.isNaN(targetMs) || Number.isNaN(currentMs) || currentMs >= targetMs) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const diffSeconds = Math.floor((targetMs - currentMs) / 1000);
  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Validates the guest RSVP form submission.
 * @param {object} payload
 * @returns {{ isValid: boolean, errors: string[], normalizedPayload: object | null }}
 */
export function validateRsvpSubmission(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: ['Los datos del formulario son inválidos.'],
      normalizedPayload: null
    };
  }

  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : '';
  const attending = payload.attending === 'yes' || payload.attending === 'no' ? payload.attending : '';
  const wishesMessage = typeof payload.wishesMessage === 'string' ? payload.wishesMessage.trim() : '';

  if (fullName.length < 3) {
    errors.push('Por favor ingresa tu nombre y apellido completos.');
  }

  if (!attending) {
    errors.push('Por favor selecciona si podrás acompañarnos.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors, normalizedPayload: null };
  }

  const guestType = typeof payload.guestType === 'string' ? payload.guestType.trim() : '';

  const normalizedPayload = {
    fullName,
    attending,
    wishesMessage
  };

  if (guestType) {
    normalizedPayload.guestType = guestType;
  }

  if (payload.modality === 'virtual' || payload.modality === 'in-person') {
    normalizedPayload.modality = payload.modality;
  }

  return {
    isValid: true,
    errors: [],
    normalizedPayload
  };
}

/**
 * Determines the invitation modality based on URL query parameters.
 * @param {string} searchString - Raw window.location.search string
 * @returns {'virtual' | 'ceremony' | 'full'}
 */
export function getInvitationModality(searchString) {
  if (typeof searchString !== 'string' || !searchString) {
    return 'full';
  }
  const params = new URLSearchParams(searchString);
  const tipo = params.get('tipo');
  const mode = params.get('mode');

  if (tipo === 'virtual' || mode === 'zoom') {
    return 'virtual';
  }
  if (tipo === 'ceremonia' || tipo === 'salon') {
    return 'ceremony';
  }
  return 'full';
}

/**
 * Determines whether virtual (Zoom) mode is active based on URL query parameters.
 * @param {string} searchString - Raw window.location.search string
 * @returns {boolean}
 */
export function isVirtualMode(searchString) {
  return getInvitationModality(searchString) === 'virtual';
}

/**
 * Resolves effective virtual modality and Google Sheets guestType label from prop or URL query params.
 * @param {boolean|undefined} isVirtualProp
 * @param {string} searchString - Raw window.location.search string
 * @returns {{ effectiveIsVirtual: boolean, guestType: 'Virtual (Zoom)' | 'Salón del Reino' | 'Presencial' }}
 */
export function resolveRsvpGuestType(isVirtualProp, searchString = '') {
  const urlModality = getInvitationModality(searchString);
  const effectiveIsVirtual = Boolean(isVirtualProp) || urlModality === 'virtual';

  let guestType = 'Presencial';
  if (effectiveIsVirtual) {
    guestType = 'Virtual (Zoom)';
  } else if (urlModality === 'ceremony') {
    guestType = 'Salón del Reino';
  }

  return {
    effectiveIsVirtual,
    guestType
  };
}

/**
 * Formats Zoom meeting credentials into a clean multi-line string for clipboard copy.
 * @param {{ meetingId?: string, passcode?: string } | null | undefined} zoomConfig
 * @returns {string}
 */
export function formatZoomCredentialsCopyText(zoomConfig) {
  if (!zoomConfig || typeof zoomConfig !== 'object') {
    return '';
  }
  const meetingId = typeof zoomConfig.meetingId === 'string' ? zoomConfig.meetingId.trim() : '';
  const passcode = typeof zoomConfig.passcode === 'string' ? zoomConfig.passcode.trim() : '';

  if (!meetingId || !passcode) {
    return '';
  }

  return `ID de Reunión: ${meetingId}\nCódigo de Acceso: ${passcode}`;
}

/**
 * Computes percentage of transparent pixels in an RGBA Uint8ClampedArray buffer.
 * @param {Uint8ClampedArray|number[]} pixelData - RGBA array (length multiple of 4)
 * @param {number} alphaThreshold - Alpha value below which a pixel is considered scratched
 * @returns {number} Integer percentage from 0 to 100
 */
export function calculateScratchPercentage(pixelData, alphaThreshold = 128) {
  if (!pixelData || pixelData.length < 4) {
    return 0;
  }
  const totalPixels = Math.floor(pixelData.length / 4);
  let transparentCount = 0;

  for (let i = 3; i < pixelData.length; i += 4) {
    if (pixelData[i] < alphaThreshold) {
      transparentCount += 1;
    }
  }

  return Math.round((transparentCount / totalPixels) * 100);
}
