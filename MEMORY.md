# MEMORY.md - Boda Valeria & Ramiro
Memoria del proyecto entre sesiones. Máximo ~50 líneas.

## Estado actual
- **Spec 001 actualizada y verificada** (`specs/001-wedding-invitation-valeria-ramiro/spec.md`).
- **Tareas completadas (`5/5`)**: `T1` a `T5` marcadas `[x]` en `specs/001-wedding-invitation-valeria-ramiro/tasks.md`.
- **Tests unitarios (`node --test`)**: `12/12` pruebas en verde en `tests/weddingLogic.test.js` y `tests/sanity.test.js` (`0` fallos).
- **Build de producción (`npm run build`)**: Compilación limpia con Vite v5.4.21 (`0` errores).
- **Modalidades por URL (`getInvitationModality`)**:
  * Presencial completa (`/`): Salón del Reino + Recepción Punta Brava, Código de Vestimenta (solo Damas y Caballeros, sin *"Estilo Formal"*), RSVP hasta `20 de Noviembre de 2026` (`guestType: 'Presencial'`).
  * Virtual Zoom (`?tipo=virtual` | `?mode=zoom`): Tarjeta Zoom debajo de la fecha, *"Consejos Bíblicos"* como título de sección sin hora repetida, sin aviso extra en Hero, sin Código de Vestimenta y sin sección/modal de Confirmar Asistencia.
  * Solo Salón del Reino (`?tipo=ceremonia` | `?tipo=salon`): Solo Salón del Reino (sin Punta Brava), sin Cronograma del Día ni Código de Vestimenta, y RSVP hasta `16 de Noviembre de 2026` (`guestType: 'Salón del Reino'`).
- **RSVP Google Sheets y Audio Oficial**: Endpoint `rsvp.googleAppsScriptWebhookUrl` en `src/config/weddingData.js`, envío `POST` (`mode: 'no-cors'`) desde `RsvpRestaurantModal.jsx`, y pista oficial `public/assets/wedding-song.mp3`.
- **Verificación móvil (`375x812 px` en Chrome DevTools)**:
  * Verificados `/`, `/?tipo=virtual`, `/?tipo=ceremonia` y `/?tipo=salon` con `0` errores de consola y `scrollWidth === 375`.
  * Pantalla de entrada (`EnvelopeIntroOverlay.jsx`) sin *"Invitación Exclusiva"* ni línea central, con el sello actualizado `/assets/wax-seal-real.png` (`loading="eager"`, `decoding="sync"`), sin `drop-shadow` ni tap highlight rectangular en Safari/iOS.
  * Día `11` y nombre del lugar *"Salón del Reino de Los Testigos de Jehová"* en dorado (`#9E7B3B`); subtítulo ajustado a *"TENDRÁN LUGAR EN"*.

## Decisiones (y por qué)
- **Configuración única (`src/config/weddingData.js`)**: Centraliza lugares oficiales, horarios, `zoomConfig`, fecha límite RSVP, fotos (`public/assets/`), código de vestimenta y contacto RSVP por WhatsApp.
- **Lógica pura separada (`src/logic/weddingLogic.js`)**: `calculateCountdown`, `validateRsvpSubmission`, `calculateScratchPercentage`, `isVirtualMode` y `formatZoomCredentialsCopyText` garantizan pruebas deterministas con `node --test` sin depender del DOM.
