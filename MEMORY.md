# MEMORY.md - Boda Valeria & Ramiro
Memoria del proyecto entre sesiones. Máximo ~50 líneas.

## Estado actual
- **Spec 001 completada y verificada** (`specs/001-wedding-invitation-valeria-ramiro/spec.md`).
- **Tareas completadas (`9/9`)**: `T1` a `T9` marcadas `[x]` en `tasks.md`.
- **Tests unitarios (`node --test`)**: `24/24` pruebas en verde en `weddingLogic.test.js` y `sanity.test.js` (`0` fallos).
- **Build de producción (`npm run build`)**: Compilación limpia con Vite v5.4.21 (`0` errores).
- **Enrutamiento universal y cupos asignados (`RF-8`)**:
  * Función pura `resolveInvitationContext` soporta rutas de pathname (`/salon-1..3`, `/boda-1..4`), hash (`/#/salon-2`) y query params (`?cupos=X`, `?tipo=salon`), con precedencia de ruta, insensibilidad a mayúsculas y normalización defensiva (1..3 para salón, 1..4 para boda, por defecto 1 en `/`).
  * `RsvpRestaurantModal` renderiza barra interactiva con botones táctiles `[ 1 ] [ 2 ] ...` bajo *"Total de personas que asistirán"*, resaltando selección en `#9E7B3B`.
  * Si el invitado marca *"No podré asistir"*, la barra se oculta y envía `0` asistentes; si vuelve a *"Sí, asistiré"*, reaparece restablecida en `1`.
- **Modalidades por URL y verificación móvil (`375x812 px` en Chrome DevTools)**:
  * Presencial completa (`/`, `/boda-1..4`): Salón + Punta Brava, Cronograma, Vestimenta y RSVP con 1 a 4 cupos táctiles (`guestType: 'Presencial'`).
  * Solo Salón (`/salon-1..3`): Salón del Reino con 1 a 3 cupos táctiles (`guestType: 'Salón del Reino'`), ocultando recepción, cronograma y vestimenta.
  * Virtual Zoom (`/?tipo=virtual` | `?mode=zoom`): subtítulo *"Transmisión en vivo desde Zoom"*, tarjeta Zoom sin horario repetido `4:30 - 6:15`, sin vestimenta ni sección RSVP físico.
  * Cero (`0`) errores en consola y ancho móvil exacto (`scrollWidth === 375`).

## Decisiones arquitectónicas
- **Configuración centralizada (`src/config/weddingData.js`)**: Lugares, horarios, webhook Google Sheets, WhatsApp y canciones sin UI flotante.
- **Lógica de negocio pura (`src/logic/weddingLogic.js`)**: `resolveInvitationContext`, `validateRsvpSubmission`, `calculateCountdown`, `calculateScratchPercentage` y utilidades Zoom aisladas y cubiertas al 100% con tests unitarios independientes del DOM.
