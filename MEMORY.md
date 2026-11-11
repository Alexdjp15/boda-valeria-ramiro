# MEMORY.md - Boda Valeria & Ramiro
Memoria del proyecto entre sesiones. Máximo ~50 líneas.

## Estado actual
- **Spec 001 actualizada y verificada** (`specs/001-wedding-invitation-valeria-ramiro/spec.md`).
- **Tareas completadas (`5/5`)**: `T1` a `T5` marcadas `[x]` en `specs/001-wedding-invitation-valeria-ramiro/tasks.md`.
- **Tests unitarios (`node --test`)**: `10/10` pruebas en verde en `tests/weddingLogic.test.js` y `tests/sanity.test.js` (`0` fallos).
- **Build de producción (`npm run build`)**: Compilación limpia con Vite v5.4.21 (`0` errores).
- **Modalidad Presencial y Virtual (Zoom)**: Soporte condicional por query params (`?tipo=virtual` o `?mode=zoom`) mediante funciones puras `isVirtualMode` y `formatZoomCredentialsCopyText` en `src/logic/weddingLogic.js`, `zoomConfig` en `src/config/weddingData.js`, tarjeta marfil con *"Unirse a la Reunión"* y copiado accesible de credenciales en `src/App.jsx`, y `src/components/RsvpRestaurantModal.jsx` adaptado.
- **RSVP Google Sheets y Audio Oficial**: Endpoint `rsvp.googleAppsScriptWebhookUrl` configurado en `src/config/weddingData.js`, envío `POST` con `mode: 'no-cors'` y `text/plain;charset=utf-8'` en `RsvpRestaurantModal.jsx` (sin bloquear la confirmación visual), y pista oficial montada en `public/assets/wedding-song.mp3`.
- **Verificación móvil (`375x812 px` en Chrome DevTools)**:
  * Verificados ambos modos (`/`, `/?tipo=virtual` y `/?mode=zoom`) con `0` errores de consola y `0` desbordamiento horizontal (`scrollWidth === 375`).
  * Sobre vertical `100vw x 100dvh` con textura marfil/lino (`from-[#FAF7F2] via-[#EFEAE1] to-[#E3DCD0]`), pliegue vertical (`border-r border-[#C8BFB0]/60`), apertura tipo libro hacia la izquierda (`rotateY(-165deg)`, `2200ms`, `cubic-bezier(0.22, 1, 0.36, 1)`) y sello físico real `/assets/wax-seal-real.png` centrado con *"Toca el sello para abrir"*.
  * Recintos, horarios (`5:00 P.M.` Consejos Bíblicos en Salón del Reino / `7:00 P.M.` Recepción en Punta Brava Techo Verde), código de vestimenta (*Damas: Vestido Largo*, *Caballeros: Traje y Corbata*), fecha límite RSVP (`20 de Noviembre de 2026`) y WhatsApp RSVP (`313 673 0779`, `https://wa.me/573136730779`) en `src/config/weddingData.js`.
  * Eliminada la sección *Un Detalle Especial / Lluvia de Sobres* (`ScratchCardCanvas`) de `src/App.jsx`.
  * Modal `RsvpRestaurantModal.jsx` con `<dialog>` nativo adaptado por modalidad (`virtual` / `in-person`) y mensaje opcional para los novios (`validateRsvpSubmission` sin menú ni cupos).

## Decisiones (y por qué)
- **Configuración única (`src/config/weddingData.js`)**: Centraliza lugares oficiales, horarios, `zoomConfig`, fecha límite RSVP, fotos (`public/assets/`), código de vestimenta y contacto RSVP por WhatsApp.
- **Lógica pura separada (`src/logic/weddingLogic.js`)**: `calculateCountdown`, `validateRsvpSubmission`, `calculateScratchPercentage`, `isVirtualMode` y `formatZoomCredentialsCopyText` garantizan pruebas deterministas con `node --test` sin depender del DOM.
