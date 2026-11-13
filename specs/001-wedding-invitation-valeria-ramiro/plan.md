# Plan Técnico - Spec 001: Invitación Digital Interactiva de Matrimonio (Valeria & Ramiro)
Actualización: Asignación de Cupos y Selector RSVP (RF-8)

## 1. Archivos y responsabilidades

| Archivo | Acción | Responsabilidad única | RF cubiertos |
| :--- | :--- | :--- | :--- |
| `src/config/weddingData.js` | Actualizar | Fuente única de configuración de la boda: límites máximos de cupos por modalidad (3 para salón, 4 para boda completa), textos oficiales, horarios y rutas de webhook. | RF-2, RF-3, RF-4, RF-7, RF-8 |
| `src/logic/weddingLogic.js` | Actualizar | Funciones puras de dominio desacopladas del DOM: cálculo de cuenta regresiva, resolución universal de modalidad y cupos (`resolveInvitationContext`), y validación estricta de RSVP con conteo de asistentes (`validateRsvpSubmission`). | RF-4, RF-5, RF-6, RF-8 |
| `tests/weddingLogic.test.js` | Actualizar | Suite de pruebas unitarias automatizadas con `node --test` que valida todas las variantes de rutas, prioridades, normalización de cupos y validación de formulario RSVP. | RF-4, RF-5, RF-6, RF-8 |
| `src/components/RsvpRestaurantModal.jsx` | Actualizar | Ventana modal accesible de confirmación RSVP: incorpora el selector táctil de cupos con botones dorados `[ 1 ] [ 2 ] ...`, gestiona la visibilidad condicional según asistencia ("Sí" / "No") y despacha el payload con el total de asistentes. | RF-6, RF-8 |
| `src/App.jsx` | Actualizar | Orquestador principal: extrae el contexto de invitación mediante `resolveInvitationContext(window.location)`, armoniza la visibilidad de secciones (oculta recepción, cronograma y código de vestimenta en solo Salón) y propaga los cupos permitidos al modal RSVP. | RF-1..RF-8 |

---

## 2. Dominio y funciones puras de lógica (`src/logic/weddingLogic.js`)

Todas las funciones son 100% puras (reciben sus parámetros de entrada de forma explícita y no dependen de variables globales ni mutan argumentos):

1. `calculateCountdown(targetIsoDate, currentDate)`
   - **Entrada**: `targetIsoDate` (`string | Date`), `currentDate` (`string | Date`).
   - **Salida**: `{ days: number, hours: number, minutes: number, seconds: number, isPast: boolean }`.
   - **RF cubiertos**: `RF-4`.

2. `resolveInvitationContext(locationLike)`
   - **Entrada**: Objeto tipo ubicación `{ pathname?: string, search?: string, hash?: string }` o cadena de texto (para máxima flexibilidad en tests y en navegador).
   - **Salida**: `{ modality: 'full' | 'ceremony' | 'virtual', maxAllowedGuests: number, rawPath: string }`.
   - **Comportamiento**:
     - Reconoce rutas amigables en `pathname` y en `hash` de forma insensible a mayúsculas:
       * `/salon-1`, `/salon-2`, `/salon-3` (y equivalentes `/#/salon-X`): modalidad `'ceremony'`, cupo `1..3`.
       * `/boda-1`, `/boda-2`, `/boda-3`, `/boda-4` (y equivalentes `/#/boda-X`): modalidad `'full'`, cupo `1..4`.
     * Precedencia: Si la ruta amigable coincide, define la modalidad y el cupo.
     * Parámetros de búsqueda (`searchParams`) actúan como respaldo: `tipo=salon` / `tipo=ceremonia` define modalidad `'ceremony'`, `tipo=virtual` / `mode=zoom` define modalidad `'virtual'`; `cupos=X` define el cupo.
     * Si no se especifica ruta ni parámetro (raíz `/`), retorna `{ modality: 'full', maxAllowedGuests: 1 }`.
     * Clamping / Normalización defensiva:
       * Para `'ceremony'`: el cupo se restringe estrictamente entre 1 y 3 (cualquier valor inválido se normaliza a 1).
       * Para `'full'`: el cupo se restringe estrictamente entre 1 y 4 (cualquier valor inválido se normaliza a 1).
       * Para `'virtual'`: `maxAllowedGuests` es 0.
   - **RF cubiertos**: `RF-4`, `RF-8`.

3. `validateRsvpSubmission(payload, maxAllowedGuests = 1)`
   - **Entrada**: `payload` (`{ fullName, attending, guestCount, wishesMessage, guestType, modality }`), `maxAllowedGuests` (`number`, límite de la tarjeta).
   - **Salida**: `{ isValid: boolean, errors: string[], normalizedPayload: object | null }`.
   - **Comportamiento**:
     - Valida `fullName` (mínimo 3 caracteres no vacíos).
     - Valida `attending` (`'yes' | 'no'`).
     - Si `attending === 'yes'`:
       * `guestCount` debe ser un entero válido comprendido entre `1` y `maxAllowedGuests`.
       * Compatibilidad hacia atrás: si `guestCount` no viene definido en confirmaciones legadas, se normaliza de forma segura a `1`.
       * Si `guestCount` está fuera de rango (`< 1` o `> maxAllowedGuests` o no es entero), genera mensaje de error claro en español.
     - Si `attending === 'no'`:
       * `guestCount` se normaliza automáticamente a `0`.
     - Retorna `normalizedPayload` con `{ fullName, attending, guestCount, wishesMessage, guestType, modality }`.
   - **RF cubiertos**: `RF-6`, `RF-8`.

4. `calculateScratchPercentage(pixelData, alphaThreshold = 128)`
   - Mantiene la función de cálculo de transparencia para pruebas unitarias.
   - **RF cubiertos**: `RF-5`.

---

## 3. Algoritmos en pseudocódigo

### 3.1 Resolución universal de contexto de invitación
```text
FUNCIÓN resolveInvitationContext(locationLike):
  extraer pathname, search, hash desde locationLike en minúsculas
  rutaLimpia <- extraerPrimerSegmentoNoVacio(pathname o hash)

  SI rutaLimpia coincide con /^salon-([1-3])$/ ENTONCES:
    cupo <- parseEntero(grupo1)
    RETORNAR { modality: 'ceremony', maxAllowedGuests: cupo, rawPath: rutaLimpia }

  SI rutaLimpia coincide con /^boda-([1-4])$/ ENTONCES:
    cupo <- parseEntero(grupo1)
    RETORNAR { modality: 'full', maxAllowedGuests: cupo, rawPath: rutaLimpia }

  // Respaldo por searchParams
  params <- parsearQueryParams(search)
  tipo <- params.get('tipo') O params.get('mode')
  cupoParam <- parseEntero(params.get('cupos'))

  SI tipo == 'virtual' O tipo == 'zoom' ENTONCES:
    RETORNAR { modality: 'virtual', maxAllowedGuests: 0, rawPath: '' }

  SI tipo == 'ceremonia' O tipo == 'salon' ENTONCES:
    cupoFinal <- SI cupoParam >= 1 Y cupoParam <= 3 ENTONCES cupoParam SINO 1
    RETORNAR { modality: 'ceremony', maxAllowedGuests: cupoFinal, rawPath: '' }

  // Modalidad por defecto completa (raíz '/')
  cupoFinal <- SI cupoParam >= 1 Y cupoParam <= 4 ENTONCES cupoParam SINO 1
  RETORNAR { modality: 'full', maxAllowedGuests: cupoFinal, rawPath: '' }
```

### 3.2 Validación de confirmación RSVP con asistentes
```text
FUNCIÓN validateRsvpSubmission(payload, maxAllowedGuests = 1):
  SI payload no es un objeto válido ENTONCES:
    RETORNAR { isValid: false, errors: ["Los datos del formulario son inválidos."], normalizedPayload: null }

  errors <- []
  fullName <- recortar(payload.fullName)
  attending <- payload.attending ('yes' o 'no')

  SI longitud(fullName) < 3 ENTONCES:
    AGREGAR "Por favor ingresa tu nombre y apellido completos." A errors

  SI attending != 'yes' Y attending != 'no' ENTONCES:
    AGREGAR "Por favor selecciona si podrás acompañarnos." A errors

  guestCount <- 0
  SI attending == 'yes' ENTONCES:
    valorEntrada <- payload.guestCount
    SI valorEntrada es indefinido O valorEntrada es nulo O valorEntrada es '' ENTONCES:
      guestCount <- 1 // compatibilidad hacia atrás
    SINO:
      num <- ParseEntero(valorEntrada)
      SI num no es entero O num < 1 O num > maxAllowedGuests ENTONCES:
        AGREGAR "Por favor selecciona el número de personas que asistirán (entre 1 y " + maxAllowedGuests + ")." A errors
      SINO:
        guestCount <- num

  SI longitud(errors) > 0 ENTONCES:
    RETORNAR { isValid: false, errors, normalizedPayload: null }

  RETORNAR {
    isValid: true,
    errors: [],
    normalizedPayload: {
      fullName,
      attending,
      guestCount,
      wishesMessage: recortar(payload.wishesMessage),
      guestType: payload.guestType,
      modality: payload.modality
    }
  }
```

---

## 4. Integración en la interfaz (UI)

1. **Selector Táctil de Cupos en `RsvpRestaurantModal.jsx`**:
   - Se muestra condicionalmente únicamente cuando `attending === 'yes'` y `!effectiveIsVirtual`.
   - Etiqueta clara: *"Total de personas que asistirán"*.
   - Contenedor en fila (`flex gap-2 justify-center`) con botones táctiles numerados desde `1` hasta `maxAllowedGuests`.
   - Dimensiones mínimas de toque móvil: `min-h-[44px] min-w-[44px]` (cumpliendo accesibilidad táctil).
   - Estilo activo: fondo `#9E7B3B`, borde `#9E7B3B`, texto blanco y sombra sutil.
   - Si `maxAllowedGuests === 1`: muestra un único botón `[ 1 ]` preseleccionado e interactivo.
   - Si el usuario cambia su selección a *"No podré asistir"*, el selector de cupos se oculta. Al volver a tocar *"Sí, asistiré"*, se restablece a `1`.

2. **Orquestación en `App.jsx`**:
   - `resolveInvitationContext(typeof window !== 'undefined' ? window.location : null)` se ejecuta al renderizar.
   - Armoniza la visibilidad de secciones según la modalidad resuelta:
     * `'ceremony'`: Se omite la sección de Recepción (Punta Brava), el cronograma y el código de vestimenta. Se muestra Ceremonia y Confirmación RSVP (fecha límite 16 de noviembre).
     * `'virtual'`: Se muestran credenciales Zoom y se omiten vestimenta y confirmación física.
     * `'full'`: Se muestran todas las secciones.
   - Se pasa `maxAllowedGuests` al componente `RsvpRestaurantModal`.

---

## 5. Decisiones técnicas justificadas

- **Decisión 1: Enrutamiento universal en función pura sin instalar dependencias de enrutador.**
  - *Por qué*: Cumple la Constitución del Proyecto (Principio 1: Simplicidad primero y stack mínimo, sin librerías pesadas no autorizadas). Permite que la aplicación funcione en cualquier hosting estático reconociendo rutas amigables en `pathname` (`/boda-2`), hash (`/#/boda-2`) o query params (`?cupos=2`) de manera resiliente.
  - *Alternativa descartada*: Instalar `react-router-dom` (innecesario para una landing page de evento, añade peso y complejidad de configuración).

- **Decisión 2: Botones segmentados táctiles para la selección de cupos en lugar de `<select>` o slider.**
  - *Por qué*: Para rangos reducidos (1 a 4 personas), botones numerados en fila ofrecen la mejor experiencia de usuario en pantallas táctiles móviles (`375 px`), con respuesta visual inmediata en dorado `#9E7B3B` y sin menús desplegables nativos que tapen el contenido.
  - *Alternativa descartada*: `<input type="range">` (confuso para rangos pequeños de 1 a 3) o lista desplegable `<select>` (menos elegante visualmente).

- **Decisión 3: Normalización defensiva y valor por defecto de 1 cupo.**
  - *Por qué*: Garantiza que si un invitado recibe un enlace dañado o abre la URL raíz `/`, la interfaz jamás falle ni se bloquee el formulario, garantizando siempre una confirmación válida con 1 cupo asignado.
  - *Alternativa descartada*: Mostrar pantalla de error 404 o bloquear la tarjeta ante parámetros inesperados.

---

## 6. Estrategia de pruebas (`node --test` + Chrome DevTools)

### 6.1 Tests unitarios (`tests/weddingLogic.test.js`)
- **Suite `resolveInvitationContext`**:
  * Caso feliz raíz `/` -> modalidad `full`, cupo `1`.
  * Rutas amigables de salón `/salon-1`, `/salon-2`, `/salon-3` -> modalidad `ceremony`, cupos `1, 2, 3`.
  * Rutas amigables de boda `/boda-1`, `/boda-2`, `/boda-3`, `/boda-4` -> modalidad `full`, cupos `1, 2, 3, 4`.
  * Rutas con hash `/#/salon-2`, `/#/boda-3`.
  * Insensibilidad a mayúsculas `/Salon-2`, `/BODA-4`.
  * Precedencia de ruta sobre query params (`/salon-1?cupos=3` -> `ceremony` con cupo `1`).
  * Respaldo por query params `?tipo=salon&cupos=2`, `?cupos=4`.
  * Casos límite: valores fuera de rango o texto (`/salon-9`, `?cupos=0`, `?cupos=abc`) -> normaliza a `1`.
  * Modalidad virtual `?tipo=virtual` -> modalidad `virtual`, cupo `0`.

- **Suite `validateRsvpSubmission`**:
  * Confirmación positiva con cupos válidos en rango `1..maxAllowedGuests`.
  * Confirmación positiva con cupos ausentes -> asume `1` por compatibilidad.
  * Confirmación positiva con cupos fuera de rango o no enteros -> genera error en español.
  * Confirmación negativa ("No asistiré") -> asigna `guestCount: 0`.

### 6.2 Verificación visual interactiva (Chrome DevTools en `375 px`)
1. Probar ruta raíz `/` (boda 1 cupo).
2. Probar `/boda-2`, `/boda-3`, `/boda-4` verificando que la barra táctil muestre exactamente los cupos correspondientes.
3. Probar `/salon-1`, `/salon-2`, `/salon-3` verificando que se omitan recepción, cronograma y vestimenta, y que el modal muestre hasta 3 cupos.
4. Probar cambio entre "Sí" y "No": verificar que la barra se oculte al marcar "No" y reaparezca en `1` al pulsar "Sí".
5. Confirmar que la consola del navegador permanezca en `0` errores.
