# Tareas de Implementación - Spec 001: Invitación Digital Interactiva de Matrimonio (Valeria & Ramiro)
Regla: Máximo 20-30 min por tarea, en orden estricto de dependencia. Implementar UNA sola tarea a la vez aplicando TDD (test en rojo -> código -> test en verde -> parar).

## Fase Inicial (Completada)
- [x] **T1. Centralizar datos oficiales de la boda y rutas de activos locales en `src/config/weddingData.js`.** Cubre: `RF-2`, `RF-3`, `RF-7`
- [x] **T2. Implementar y validar funciones puras de dominio en `src/logic/weddingLogic.js` mediante TDD (`node --test`).** Cubre: `RF-4`, `RF-5`, `RF-6`, `RNF-2`
- [x] **T3. Implementar el sobre vertical a pantalla completa (`100vw x 100dvh`) con apertura hacia la izquierda y sello `"V & R"` centrado.** Cubre: `RF-1`, `RNF-1`
- [x] **T4. Construir el lienzo interactivo `<canvas>` para *"Lluvia de Sobres"* y el modal RSVP para el restaurante.** Cubre: `RF-5`, `RF-6`
- [x] **T5. Orquestar la tarjeta principal en `src/App.jsx` aplicando la regla *Zero Clipping*, fondo floral original, *placeholders* de recintos y verificación móvil (`375 px`).** Cubre: `RF-1` a `RF-7`, `RNF-1`, `RNF-3`

---

## Fase Actual: Asignación de Cupos y Selector RSVP (RF-8)

- [x] **T6. Implementar y probar la resolución universal de modalidad y cupos (`resolveInvitationContext`) en `src/logic/weddingLogic.js` mediante TDD.** Cubre: `RF-4`, `RF-8`, `RNF-2`
  - **Archivos**: `tests/weddingLogic.test.js`, `src/logic/weddingLogic.js`
  - **Hecho cuando**: La función pura `resolveInvitationContext` soporta rutas de `pathname` (`/salon-1..3`, `/boda-1..4`), hash (`/#/salon-2`), y parámetros de búsqueda (`?cupos=X`), con insensibilidad a mayúsculas, precedencia de ruta, normalización segura (1..3 para salón, 1..4 para boda, 1 por defecto en `/`), y `node --test tests/weddingLogic.test.js` pasa 100% en verde con nuevas pruebas exhaustivas.

- [x] **T7. Actualizar la validación pura de confirmación RSVP (`validateRsvpSubmission`) con soporte para conteo de asistentes mediante TDD.** Cubre: `RF-6`, `RF-8`, `RNF-2`
  - **Archivos**: `tests/weddingLogic.test.js`, `src/logic/weddingLogic.js`
  - **Hecho cuando**: `validateRsvpSubmission` valida que el número de asistentes sea un entero en el rango `1..maxAllowedGuests` cuando `attending === 'yes'`, asigna `0` cuando `attending === 'no'`, mantiene compatibilidad hacia atrás asumiendo `1` si el dato no se provee, rechaza valores inválidos con mensaje en español, y `node --test tests/weddingLogic.test.js` finaliza 100% en verde.

- [x] **T8. Integrar el selector táctil de cupos en `RsvpRestaurantModal.jsx` y el enrutamiento universal en `src/App.jsx`.** Cubre: `RF-4`, `RF-6`, `RF-8`, `RNF-1`
  - **Archivos**: `src/components/RsvpRestaurantModal.jsx`, `src/App.jsx`
  - **Hecho cuando**: El modal RSVP presenta la barra interactiva con botones táctiles `[ 1 ] [ 2 ] ...` resaltando la selección en dorado `#9E7B3B` bajo el título *"Total de personas que asistirán"*; se oculta si `attending === 'no'` y se restablece en 1 al volver a marcar `yes`; `App.jsx` resuelve el contexto con `resolveInvitationContext`, oculta recepción, cronograma y código de vestimenta para solo Salón (`ceremony`), y propaga los cupos correspondientes.

- [x] **T9. Verificación integral de todas las modalidades y cupos en vista móvil (`375 px`), consola y compilación limpia.** Cubre: `RF-1` a `RF-8`, `RNF-1`, `RNF-3`
  - **Archivos**: `specs/001-wedding-invitation-valeria-ramiro/tasks.md`, `specs/001-wedding-invitation-valeria-ramiro/spec.md`, `MEMORY.md`
  - **Hecho cuando**: Se verifican visualmente en Chrome DevTools las variantes `/` (boda 1 cupo), `/boda-2`, `/boda-3`, `/boda-4`, `/salon-1`, `/salon-2`, `/salon-3` y modalidad virtual con `0` errores de consola y ancho de `375 px`; `npm run build` compila con éxito; todos los tests unitarios (`node --test`) pasan en verde; y se actualiza `MEMORY.md`.
