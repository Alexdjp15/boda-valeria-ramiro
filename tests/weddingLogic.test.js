import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCountdown,
  validateRsvpSubmission,
  calculateScratchPercentage,
  isVirtualMode,
  getInvitationModality,
  formatZoomCredentialsCopyText,
  resolveRsvpGuestType,
  resolveInvitationContext
} from '../src/logic/weddingLogic.js';

test('RF-4: calculateCountdown returns exact days, hours, minutes and seconds before wedding', () => {
  const target = '2026-12-11T16:00:00-05:00';
  const current = '2026-12-01T14:30:15-05:00';
  const result = calculateCountdown(target, current);

  assert.equal(result.isPast, false);
  assert.equal(result.days, 10);
  assert.equal(result.hours, 1);
  assert.equal(result.minutes, 29);
  assert.equal(result.seconds, 45);
});

test('RF-4: calculateCountdown handles past and invalid dates safely', () => {
  const target = '2026-12-11T16:00:00-05:00';
  const pastResult = calculateCountdown(target, '2026-12-12T10:00:00-05:00');
  assert.deepEqual(pastResult, { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });

  const invalidResult = calculateCountdown('invalid-date', '2026-12-01T10:00:00-05:00');
  assert.deepEqual(invalidResult, { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
});

test('RF-6: validateRsvpSubmission accepts valid attending confirmation with optional wishesMessage and without menu/guestCount', () => {
  const validResult = validateRsvpSubmission({
    fullName: '  Carlos Vives  ',
    attending: 'yes',
    wishesMessage: ' ¡Muchas felicidades Valeria y Ramiro! '
  });

  assert.equal(validResult.isValid, true);
  assert.equal(validResult.errors.length, 0);
  assert.deepEqual(validResult.normalizedPayload, {
    fullName: 'Carlos Vives',
    attending: 'yes',
    guestCount: 1,
    wishesMessage: '¡Muchas felicidades Valeria y Ramiro!'
  });

  const withoutMessage = validateRsvpSubmission({
    fullName: 'María José Pérez',
    attending: 'yes'
  });

  assert.equal(withoutMessage.isValid, true);
  assert.deepEqual(withoutMessage.normalizedPayload, {
    fullName: 'María José Pérez',
    attending: 'yes',
    guestCount: 1,
    wishesMessage: ''
  });
});

test('RF-6: validateRsvpSubmission rejects short name, missing attendance, or invalid payload', () => {
  const shortNameAndNoAttendance = validateRsvpSubmission({
    fullName: 'Jo',
    attending: ''
  });
  assert.equal(shortNameAndNoAttendance.isValid, false);
  assert.equal(shortNameAndNoAttendance.errors.length, 2);

  const missingAttending = validateRsvpSubmission({
    fullName: 'Elena Ospina',
    attending: ''
  });
  assert.equal(missingAttending.isValid, false);
  assert.equal(missingAttending.errors.length, 1);

  const invalidPayload = validateRsvpSubmission(null);
  assert.equal(invalidPayload.isValid, false);
});

test('RF-6: validateRsvpSubmission accepts non-attending guest with optional wishesMessage', () => {
  const notAttending = validateRsvpSubmission({
    fullName: 'Andrés Cepeda',
    attending: 'no',
    wishesMessage: 'No podré asistir, pero les deseo lo mejor'
  });

  assert.equal(notAttending.isValid, true);
  assert.deepEqual(notAttending.normalizedPayload, {
    fullName: 'Andrés Cepeda',
    attending: 'no',
    guestCount: 0,
    wishesMessage: 'No podré asistir, pero les deseo lo mejor'
  });
});

test('RF-5: calculateScratchPercentage accurately measures cleared canvas pixels and edge cases', () => {
  const halfScratchedRgba = [
    200, 170, 90, 255, // opaque
    200, 170, 90, 0,   // scratched
    200, 170, 90, 0,   // scratched
    200, 170, 90, 255  // opaque
  ];
  assert.equal(calculateScratchPercentage(halfScratchedRgba), 50);

  const fullyScratchedRgba = [
    200, 170, 90, 0,
    200, 170, 90, 10
  ];
  assert.equal(calculateScratchPercentage(fullyScratchedRgba), 100);

  const untouchedRgba = [
    200, 170, 90, 255,
    200, 170, 90, 255
  ];
  assert.equal(calculateScratchPercentage(untouchedRgba), 0);
  assert.equal(calculateScratchPercentage(null), 0);
  assert.equal(calculateScratchPercentage([]), 0);
});

test('Zoom Virtual Mode: isVirtualMode detects ?tipo=virtual and ?mode=zoom accurately', () => {
  assert.equal(isVirtualMode('?tipo=virtual'), true);
  assert.equal(isVirtualMode('?mode=zoom'), true);
  assert.equal(isVirtualMode('?guest=ana&tipo=virtual'), true);
  assert.equal(isVirtualMode('?tipo=presencial&mode=zoom'), true);
  assert.equal(isVirtualMode(''), false);
  assert.equal(isVirtualMode('?tipo=presencial'), false);
  assert.equal(isVirtualMode('?mode=in-person'), false);
  assert.equal(isVirtualMode(null), false);
  assert.equal(isVirtualMode(undefined), false);
});

test('Zoom Virtual Mode: formatZoomCredentialsCopyText formats meeting ID and passcode safely', () => {
  const formatted = formatZoomCredentialsCopyText({
    meetingId: '898 0596 3404',
    passcode: '111226'
  });
  assert.equal(formatted, 'ID de Reunión: 898 0596 3404\nCódigo de Acceso: 111226');
  assert.equal(formatZoomCredentialsCopyText(null), '');
  assert.equal(formatZoomCredentialsCopyText({}), '');
});

test('Zoom Virtual Mode: validateRsvpSubmission preserves optional modality and guestType for 5-column Sheets payload', () => {
  const virtualRsvp = validateRsvpSubmission({
    fullName: 'Laura Gómez',
    attending: 'yes',
    wishesMessage: 'Nos conectaremos con mucha alegría',
    modality: 'virtual'
  });

  assert.equal(virtualRsvp.isValid, true);
  assert.deepEqual(virtualRsvp.normalizedPayload, {
    fullName: 'Laura Gómez',
    attending: 'yes',
    guestCount: 1,
    wishesMessage: 'Nos conectaremos con mucha alegría',
    modality: 'virtual'
  });

  const sheetsVirtualPayload = validateRsvpSubmission({
    fullName: '  Laura Gómez  ',
    attending: 'yes',
    guestType: 'Virtual (Zoom)',
    wishesMessage: '  Bendiciones  '
  });

  assert.equal(sheetsVirtualPayload.isValid, true);
  assert.deepEqual(sheetsVirtualPayload.normalizedPayload, {
    fullName: 'Laura Gómez',
    attending: 'yes',
    guestCount: 1,
    guestType: 'Virtual (Zoom)',
    wishesMessage: 'Bendiciones'
  });

  const sheetsInPersonPayload = validateRsvpSubmission({
    fullName: 'Carlos Pérez',
    attending: 'no',
    guestType: 'Presencial',
    wishesMessage: ''
  });

  assert.equal(sheetsInPersonPayload.isValid, true);
  assert.deepEqual(sheetsInPersonPayload.normalizedPayload, {
    fullName: 'Carlos Pérez',
    attending: 'no',
    guestCount: 0,
    guestType: 'Presencial',
    wishesMessage: ''
  });
});

test('Zoom Virtual Mode: resolveRsvpGuestType uses prop or falls back to URL query params', () => {
  assert.deepEqual(resolveRsvpGuestType(true, ''), {
    effectiveIsVirtual: true,
    guestType: 'Virtual (Zoom)'
  });
  assert.deepEqual(resolveRsvpGuestType(false, '?tipo=virtual'), {
    effectiveIsVirtual: true,
    guestType: 'Virtual (Zoom)'
  });
  assert.deepEqual(resolveRsvpGuestType(false, '?mode=zoom'), {
    effectiveIsVirtual: true,
    guestType: 'Virtual (Zoom)'
  });
  assert.deepEqual(resolveRsvpGuestType(false, ''), {
    effectiveIsVirtual: false,
    guestType: 'Presencial'
  });
  assert.deepEqual(resolveRsvpGuestType(undefined, '?tipo=presencial'), {
    effectiveIsVirtual: false,
    guestType: 'Presencial'
  });
  assert.deepEqual(resolveRsvpGuestType(false, '?tipo=ceremonia'), {
    effectiveIsVirtual: false,
    guestType: 'Salón del Reino'
  });
  assert.deepEqual(resolveRsvpGuestType(false, '?tipo=salon'), {
    effectiveIsVirtual: false,
    guestType: 'Salón del Reino'
  });
  assert.deepEqual(resolveRsvpGuestType(false, '/salon-2'), {
    effectiveIsVirtual: false,
    guestType: 'Salón del Reino'
  });
  assert.deepEqual(resolveRsvpGuestType(false, { pathname: '/salon-3' }), {
    effectiveIsVirtual: false,
    guestType: 'Salón del Reino'
  });
  assert.deepEqual(resolveRsvpGuestType(false, '/boda-2'), {
    effectiveIsVirtual: false,
    guestType: 'Presencial'
  });
});

test('Invitation Modality: getInvitationModality detects virtual, ceremony, and full modes accurately', () => {
  assert.equal(getInvitationModality('?tipo=virtual'), 'virtual');
  assert.equal(getInvitationModality('?mode=zoom'), 'virtual');
  assert.equal(getInvitationModality('?tipo=ceremonia'), 'ceremony');
  assert.equal(getInvitationModality('?tipo=salon'), 'ceremony');
  assert.equal(getInvitationModality('?guest=ana&tipo=salon'), 'ceremony');
  assert.equal(getInvitationModality(''), 'full');
  assert.equal(getInvitationModality('?tipo=presencial'), 'full');
  assert.equal(getInvitationModality(null), 'full');
  assert.equal(getInvitationModality(undefined), 'full');
});

test('RF-4 & RF-8: resolveInvitationContext resolves friendly pathname routes for ceremony and full modality', () => {
  // Ceremony routes (1..3)
  assert.deepEqual(resolveInvitationContext('/salon-1'), { modality: 'ceremony', maxAllowedGuests: 1, rawPath: 'salon-1' });
  assert.deepEqual(resolveInvitationContext('/salon-2'), { modality: 'ceremony', maxAllowedGuests: 2, rawPath: 'salon-2' });
  assert.deepEqual(resolveInvitationContext('/salon-3'), { modality: 'ceremony', maxAllowedGuests: 3, rawPath: 'salon-3' });

  // Full modality routes (1..4)
  assert.deepEqual(resolveInvitationContext('/boda-1'), { modality: 'full', maxAllowedGuests: 1, rawPath: 'boda-1' });
  assert.deepEqual(resolveInvitationContext('/boda-2'), { modality: 'full', maxAllowedGuests: 2, rawPath: 'boda-2' });
  assert.deepEqual(resolveInvitationContext('/boda-3'), { modality: 'full', maxAllowedGuests: 3, rawPath: 'boda-3' });
  assert.deepEqual(resolveInvitationContext('/boda-4'), { modality: 'full', maxAllowedGuests: 4, rawPath: 'boda-4' });
});

test('RF-8: resolveInvitationContext resolves hash routes seamlessly', () => {
  assert.deepEqual(resolveInvitationContext('/#/salon-2'), { modality: 'ceremony', maxAllowedGuests: 2, rawPath: 'salon-2' });
  assert.deepEqual(resolveInvitationContext('#/salon-1'), { modality: 'ceremony', maxAllowedGuests: 1, rawPath: 'salon-1' });
  assert.deepEqual(resolveInvitationContext('/#/boda-3'), { modality: 'full', maxAllowedGuests: 3, rawPath: 'boda-3' });
  assert.deepEqual(resolveInvitationContext({ hash: '#/boda-4' }), { modality: 'full', maxAllowedGuests: 4, rawPath: 'boda-4' });
});

test('RF-8: resolveInvitationContext is case-insensitive for paths and query parameters', () => {
  assert.deepEqual(resolveInvitationContext('/Salon-2'), { modality: 'ceremony', maxAllowedGuests: 2, rawPath: 'salon-2' });
  assert.deepEqual(resolveInvitationContext('/BODA-3'), { modality: 'full', maxAllowedGuests: 3, rawPath: 'boda-3' });
  assert.deepEqual(resolveInvitationContext('/#/SALON-3'), { modality: 'ceremony', maxAllowedGuests: 3, rawPath: 'salon-3' });
  assert.deepEqual(resolveInvitationContext('?tipo=SALON&cupos=2'), { modality: 'ceremony', maxAllowedGuests: 2, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?TIPO=CEREMONIA&CUPOS=3'), { modality: 'ceremony', maxAllowedGuests: 3, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?tipo=VIRTUAL'), { modality: 'virtual', maxAllowedGuests: 0, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?mode=ZOOM'), { modality: 'virtual', maxAllowedGuests: 0, rawPath: '' });
});

test('RF-4 & RF-8: resolveInvitationContext handles query params fallback', () => {
  assert.deepEqual(resolveInvitationContext('?cupos=2'), { modality: 'full', maxAllowedGuests: 2, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?cupos=4'), { modality: 'full', maxAllowedGuests: 4, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?tipo=salon&cupos=3'), { modality: 'ceremony', maxAllowedGuests: 3, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?tipo=ceremonia&cupos=2'), { modality: 'ceremony', maxAllowedGuests: 2, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?tipo=virtual'), { modality: 'virtual', maxAllowedGuests: 0, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?mode=zoom'), { modality: 'virtual', maxAllowedGuests: 0, rawPath: '' });
});

test('RF-8: resolveInvitationContext prioritizes friendly route over query params', () => {
  assert.deepEqual(
    resolveInvitationContext('/salon-2?cupos=4'),
    { modality: 'ceremony', maxAllowedGuests: 2, rawPath: 'salon-2' }
  );
  assert.deepEqual(
    resolveInvitationContext('/boda-3?tipo=salon&cupos=1'),
    { modality: 'full', maxAllowedGuests: 3, rawPath: 'boda-3' }
  );
  assert.deepEqual(
    resolveInvitationContext('/#/salon-1?cupos=4'),
    { modality: 'ceremony', maxAllowedGuests: 1, rawPath: 'salon-1' }
  );
});

test('RF-8: resolveInvitationContext defaults safely to full modality with 1 guest for root or empty inputs', () => {
  assert.deepEqual(resolveInvitationContext('/'), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext(''), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext(null), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext(undefined), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext({}), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext({ pathname: '/', search: '', hash: '' }), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
});

test('RF-8: resolveInvitationContext performs defensive normalization for invalid, decimal, or out-of-range values', () => {
  // Below 1
  assert.deepEqual(resolveInvitationContext('?cupos=0'), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?cupos=-2'), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('/salon-0'), { modality: 'ceremony', maxAllowedGuests: 1, rawPath: 'salon-0' });

  // Above modality limit (max 3 for ceremony, max 4 for full)
  assert.deepEqual(resolveInvitationContext('/salon-4'), { modality: 'ceremony', maxAllowedGuests: 1, rawPath: 'salon-4' });
  assert.deepEqual(resolveInvitationContext('/salon-9'), { modality: 'ceremony', maxAllowedGuests: 1, rawPath: 'salon-9' });
  assert.deepEqual(resolveInvitationContext('?tipo=salon&cupos=4'), { modality: 'ceremony', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('/boda-5'), { modality: 'full', maxAllowedGuests: 1, rawPath: 'boda-5' });
  assert.deepEqual(resolveInvitationContext('?cupos=10'), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });

  // Non-numeric or decimal
  assert.deepEqual(resolveInvitationContext('?cupos=abc'), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('?cupos=2.5'), { modality: 'full', maxAllowedGuests: 1, rawPath: '' });
  assert.deepEqual(resolveInvitationContext('/salon-abc'), { modality: 'ceremony', maxAllowedGuests: 1, rawPath: 'salon-abc' });
  assert.deepEqual(resolveInvitationContext('/boda-2.5'), { modality: 'full', maxAllowedGuests: 1, rawPath: 'boda-2.5' });
});

test('RF-8: resolveInvitationContext supports window.location-like objects and full URLs', () => {
  const windowLocationMock = {
    pathname: '/salon-3',
    search: '',
    hash: ''
  };
  assert.deepEqual(resolveInvitationContext(windowLocationMock), { modality: 'ceremony', maxAllowedGuests: 3, rawPath: 'salon-3' });

  const fullUrl = 'https://valeriayramiro.boda/boda-2?fuente=whatsapp';
  assert.deepEqual(resolveInvitationContext(fullUrl), { modality: 'full', maxAllowedGuests: 2, rawPath: 'boda-2' });

  const fullUrlWithHash = 'https://valeriayramiro.boda/#/salon-1';
  assert.deepEqual(resolveInvitationContext(fullUrlWithHash), { modality: 'ceremony', maxAllowedGuests: 1, rawPath: 'salon-1' });
});

test('RF-6 & RF-8: validateRsvpSubmission accepts guestCount within range 1..maxAllowedGuests when attending === "yes"', () => {
  const result1 = validateRsvpSubmission({
    fullName: 'Ramiro Meneses',
    attending: 'yes',
    guestCount: 1
  }, 1);
  assert.equal(result1.isValid, true);
  assert.equal(result1.normalizedPayload.guestCount, 1);

  const result3 = validateRsvpSubmission({
    fullName: 'Valeria Duque',
    attending: 'yes',
    guestCount: 3
  }, 3);
  assert.equal(result3.isValid, true);
  assert.equal(result3.normalizedPayload.guestCount, 3);

  const result4 = validateRsvpSubmission({
    fullName: 'Familia Duque',
    attending: 'yes',
    guestCount: 4
  }, 4);
  assert.equal(result4.isValid, true);
  assert.equal(result4.normalizedPayload.guestCount, 4);

  // String number parsing
  const resultStringNum = validateRsvpSubmission({
    fullName: 'Familia Ramírez',
    attending: 'yes',
    guestCount: '2'
  }, 3);
  assert.equal(resultStringNum.isValid, true);
  assert.equal(resultStringNum.normalizedPayload.guestCount, 2);
});

test('RF-6 & RF-8: validateRsvpSubmission normalizes guestCount to 0 when attending === "no" regardless of input', () => {
  const resultNoWithCount = validateRsvpSubmission({
    fullName: 'Andrés Cepeda',
    attending: 'no',
    guestCount: 3
  }, 4);
  assert.equal(resultNoWithCount.isValid, true);
  assert.equal(resultNoWithCount.normalizedPayload.guestCount, 0);

  const resultNoWithoutCount = validateRsvpSubmission({
    fullName: 'Andrés Cepeda',
    attending: 'no'
  });
  assert.equal(resultNoWithoutCount.isValid, true);
  assert.equal(resultNoWithoutCount.normalizedPayload.guestCount, 0);

  const resultNoWithInvalid = validateRsvpSubmission({
    fullName: 'Andrés Cepeda',
    attending: 'no',
    guestCount: 'invalido'
  });
  assert.equal(resultNoWithInvalid.isValid, true);
  assert.equal(resultNoWithInvalid.normalizedPayload.guestCount, 0);
});

test('RF-6 & RF-8: validateRsvpSubmission safely defaults guestCount to 1 for backward compatibility when attending === "yes"', () => {
  const resultUndefined = validateRsvpSubmission({
    fullName: 'Mariana Pajón',
    attending: 'yes'
  }, 3);
  assert.equal(resultUndefined.isValid, true);
  assert.equal(resultUndefined.normalizedPayload.guestCount, 1);

  const resultNull = validateRsvpSubmission({
    fullName: 'Mariana Pajón',
    attending: 'yes',
    guestCount: null
  }, 3);
  assert.equal(resultNull.isValid, true);
  assert.equal(resultNull.normalizedPayload.guestCount, 1);

  const resultEmptyString = validateRsvpSubmission({
    fullName: 'Mariana Pajón',
    attending: 'yes',
    guestCount: ''
  }, 3);
  assert.equal(resultEmptyString.isValid, true);
  assert.equal(resultEmptyString.normalizedPayload.guestCount, 1);
});

test('RF-6 & RF-8: validateRsvpSubmission rejects invalid or out-of-range guestCount when attending === "yes"', () => {
  // guestCount = 0
  const resultZero = validateRsvpSubmission({
    fullName: 'Camilo Echeverry',
    attending: 'yes',
    guestCount: 0
  }, 4);
  assert.equal(resultZero.isValid, false);
  assert.equal(resultZero.normalizedPayload, null);
  assert.ok(resultZero.errors.some(err => err.includes('1 y 4')));

  // guestCount > maxAllowedGuests
  const resultExceeded = validateRsvpSubmission({
    fullName: 'Camilo Echeverry',
    attending: 'yes',
    guestCount: 5
  }, 4);
  assert.equal(resultExceeded.isValid, false);
  assert.ok(resultExceeded.errors.some(err => err.includes('1 y 4')));

  const resultExceededCeremony = validateRsvpSubmission({
    fullName: 'Camilo Echeverry',
    attending: 'yes',
    guestCount: 4
  }, 3);
  assert.equal(resultExceededCeremony.isValid, false);
  assert.ok(resultExceededCeremony.errors.some(err => err.includes('1 y 3')));

  // Negative number
  const resultNegative = validateRsvpSubmission({
    fullName: 'Camilo Echeverry',
    attending: 'yes',
    guestCount: -1
  }, 2);
  assert.equal(resultNegative.isValid, false);

  // Decimal number
  const resultDecimal = validateRsvpSubmission({
    fullName: 'Camilo Echeverry',
    attending: 'yes',
    guestCount: 2.5
  }, 3);
  assert.equal(resultDecimal.isValid, false);

  // Non-numeric string
  const resultText = validateRsvpSubmission({
    fullName: 'Camilo Echeverry',
    attending: 'yes',
    guestCount: 'dos'
  }, 3);
  assert.equal(resultText.isValid, false);
});

