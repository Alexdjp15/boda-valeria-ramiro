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
 * Validates the guest RSVP form submission with guest count support.
 * @param {object} payload
 * @param {number} [maxAllowedGuests=1]
 * @returns {{ isValid: boolean, errors: string[], normalizedPayload: object | null }}
 */
export function validateRsvpSubmission(payload, maxAllowedGuests = 1) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: ['Los datos del formulario son inválidos.'],
      normalizedPayload: null
    };
  }

  const effectiveMaxGuests =
    Number.isInteger(maxAllowedGuests) && maxAllowedGuests >= 1 ? maxAllowedGuests : 1;

  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : '';
  const attending = payload.attending === 'yes' || payload.attending === 'no' ? payload.attending : '';
  const wishesMessage = typeof payload.wishesMessage === 'string' ? payload.wishesMessage.trim() : '';

  if (fullName.length < 3) {
    errors.push('Por favor ingresa tu nombre y apellido completos.');
  }

  if (!attending) {
    errors.push('Por favor selecciona si podrás acompañarnos.');
  }

  let guestCount = 0;
  if (attending === 'yes') {
    const rawCount = payload.guestCount;
    if (rawCount === undefined || rawCount === null || rawCount === '') {
      guestCount = 1;
    } else {
      let parsed = NaN;
      if (typeof rawCount === 'number' && Number.isInteger(rawCount)) {
        parsed = rawCount;
      } else if (typeof rawCount === 'string' && rawCount.trim() !== '') {
        const num = Number(rawCount.trim());
        if (Number.isInteger(num)) {
          parsed = num;
        }
      }

      if (Number.isNaN(parsed) || parsed < 1 || parsed > effectiveMaxGuests) {
        errors.push(
          `Por favor selecciona el número de personas que asistirán (entre 1 y ${effectiveMaxGuests}).`
        );
      } else {
        guestCount = parsed;
      }
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors, normalizedPayload: null };
  }

  const guestType = typeof payload.guestType === 'string' ? payload.guestType.trim() : '';

  const normalizedPayload = {
    fullName,
    attending,
    guestCount,
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
 * Resolves effective virtual modality and Google Sheets guestType label from prop, search string, or location object.
 * @param {boolean|undefined} isVirtualProp
 * @param {string|object} searchOrLocation - Raw window.location.search string, URL, or location object
 * @returns {{ effectiveIsVirtual: boolean, guestType: 'Virtual (Zoom)' | 'Salón del Reino' | 'Presencial' }}
 */
export function resolveRsvpGuestType(isVirtualProp, searchOrLocation = '') {
  let urlModality = 'full';
  if (typeof searchOrLocation === 'string' && (searchOrLocation.startsWith('?') || !searchOrLocation)) {
    urlModality = getInvitationModality(searchOrLocation);
  } else if (searchOrLocation) {
    const ctx = resolveInvitationContext(searchOrLocation);
    urlModality = ctx.modality;
  }
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

/**
 * Resolves the wedding invitation modality and maximum allowed guests from the browser location or URL string.
 * Supports friendly pathname routes (/salon-1..3, /boda-1..4), hash routes (/#/salon-2),
 * and query parameters (?cupos=X, ?tipo=salon, ?tipo=virtual), with case-insensitivity,
 * friendly route precedence, and defensive clamping/normalization.
 *
 * @param {object|string|null|undefined} locationLike - window.location, URL string, or object with pathname, search, hash
 * @returns {{ modality: 'full' | 'ceremony' | 'virtual', maxAllowedGuests: number, rawPath: string }}
 */
export function resolveInvitationContext(locationLike) {
  let pathname = '';
  let search = '';
  let hash = '';

  if (typeof locationLike === 'string') {
    try {
      const parsedUrl = new URL(locationLike, 'http://localhost');
      pathname = parsedUrl.pathname;
      search = parsedUrl.search;
      hash = parsedUrl.hash;
    } catch {
      pathname = '';
      search = '';
      hash = '';
    }
  } else if (locationLike && typeof locationLike === 'object') {
    pathname = typeof locationLike.pathname === 'string' ? locationLike.pathname : '';
    search = typeof locationLike.search === 'string' ? locationLike.search : '';
    hash = typeof locationLike.hash === 'string' ? locationLike.hash : '';
  }

  // 1. Extract path segments from pathname and hash
  const pathSegments = pathname.toLowerCase().split('/').filter(Boolean);
  const hashClean = hash.toLowerCase().replace(/^#\/?/, '');

  let hashPath = hashClean;
  let hashSearch = '';
  const hashQuestionIdx = hashClean.indexOf('?');
  if (hashQuestionIdx !== -1) {
    hashPath = hashClean.slice(0, hashQuestionIdx);
    hashSearch = hashClean.slice(hashQuestionIdx);
  }

  const hashSegments = hashPath.split('/').filter(Boolean);
  const candidateSegments = [...pathSegments, ...hashSegments];

  for (const segment of candidateSegments) {
    // Check ceremony route (e.g., salon, salon-1, salon-2, salon-3, salon-9)
    const salonMatch = segment.match(/^salon(?:-([^\s/?#]+))?$/);
    if (salonMatch) {
      const rawCount = salonMatch[1];
      let maxAllowedGuests = 1;
      if (rawCount !== undefined) {
        const num = Number(rawCount);
        if (Number.isInteger(num) && num >= 1 && num <= 3) {
          maxAllowedGuests = num;
        }
      }
      return {
        modality: 'ceremony',
        maxAllowedGuests,
        rawPath: segment
      };
    }

    // Check full wedding route (e.g., boda, boda-1, boda-2, boda-3, boda-4, boda-5)
    const bodaMatch = segment.match(/^boda(?:-([^\s/?#]+))?$/);
    if (bodaMatch) {
      const rawCount = bodaMatch[1];
      let maxAllowedGuests = 1;
      if (rawCount !== undefined) {
        const num = Number(rawCount);
        if (Number.isInteger(num) && num >= 1 && num <= 4) {
          maxAllowedGuests = num;
        }
      }
      return {
        modality: 'full',
        maxAllowedGuests,
        rawPath: segment
      };
    }

    // Friendly route for virtual modality
    if (segment === 'virtual' || segment === 'zoom') {
      return {
        modality: 'virtual',
        maxAllowedGuests: 0,
        rawPath: segment
      };
    }
  }

  // 2. Fallback to query parameters in search or hash search
  const normalizedParams = new Map();
  if (search) {
    const searchParams = new URLSearchParams(search);
    for (const [k, v] of searchParams.entries()) {
      normalizedParams.set(k.toLowerCase(), v);
    }
  }
  if (hashSearch) {
    const hashParams = new URLSearchParams(hashSearch);
    for (const [k, v] of hashParams.entries()) {
      if (!normalizedParams.has(k.toLowerCase())) {
        normalizedParams.set(k.toLowerCase(), v);
      }
    }
  }

  const tipo = (normalizedParams.get('tipo') || '').toLowerCase();
  const mode = (normalizedParams.get('mode') || '').toLowerCase();
  const rawCupos = normalizedParams.get('cupos');

  let parsedCupos = NaN;
  if (typeof rawCupos === 'string' && rawCupos.trim() !== '') {
    const num = Number(rawCupos);
    if (Number.isInteger(num)) {
      parsedCupos = num;
    }
  }

  if (tipo === 'virtual' || mode === 'zoom') {
    return {
      modality: 'virtual',
      maxAllowedGuests: 0,
      rawPath: ''
    };
  }

  if (tipo === 'ceremonia' || tipo === 'salon') {
    const maxAllowedGuests = parsedCupos >= 1 && parsedCupos <= 3 ? parsedCupos : 1;
    return {
      modality: 'ceremony',
      maxAllowedGuests,
      rawPath: ''
    };
  }

  // Default: full modality ('full')
  const maxAllowedGuests = parsedCupos >= 1 && parsedCupos <= 4 ? parsedCupos : 1;
  return {
    modality: 'full',
    maxAllowedGuests,
    rawPath: ''
  };
}

