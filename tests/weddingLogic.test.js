import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCountdown,
  validateRsvpSubmission,
  calculateScratchPercentage,
  isVirtualMode,
  formatZoomCredentialsCopyText
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
    guestType: 'Presencial',
    wishesMessage: ''
  });
});
