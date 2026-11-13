# Spec 001 - Invitación Digital Interactiva de Matrimonio (Valeria & Ramiro)
Estado: implementada (actualización cupos RSVP)

## Contexto y objetivo
Desarrollar una aplicación web interactiva *mobile-first* de invitación de matrimonio para **Valeria Albus Sánchez & Ramiro Ballestas Molina** (**Viernes, 11 de Diciembre de 2026**, **Santa Marta, Colombia**), siguiendo rigurosamente la metodología SDD y los principios de `docs/constitution.md`.

Dado que los detalles finales de recintos y fotografías aún están pendientes por definir, el sistema operará con una versión de previsualización robusta (*preview build*) utilizando recursos temporales genéricos y marcos de reemplazo (*placeholders*) limpios. Todo el código fuente, componentes, variables, estado y pruebas (`node --test`) estarán escritos 100% en inglés, mientras que toda la interfaz de usuario, mensajes, botones y documentación estarán 100% en español. Toda la información de la boda se centraliza en `src/config/weddingData.js` para permitir actualizaciones futuras directamente en código sin paneles ni botones flotantes de configuración.

## Usuarios / actores
- **Invitado de la boda**: Accede desde su dispositivo móvil, visualiza el sobre vertical a pantalla completa, toca el sello de lacre `"V & R"` para abrir la invitación hacia la izquierda, escucha la música de fondo, consulta la cuenta regresiva, ubicaciones, cronograma y código de vestimenta, y envía su confirmación de asistencia (RSVP).
- **Pareja anfitriona / Agente de desarrollo**: Actualiza lugares, horarios, fotografías (`public/assets/`) y pista musical directamente en `src/config/weddingData.js`.

## Historias de usuario
- **HU-1**: Como invitado en móvil, quiero ver un sobre vertical a pantalla completa con el sello de lacre `"V & R"` centrado que se abra suavemente hacia la izquierda al tocarlo.
- **HU-2**: Como invitado, quiero que todos los títulos caligráficos (*Valeria Albus Sánchez*, *Ramiro Ballestas Molina*, *Santa Marta, Colombia*) se muestren completos y nítidos sobre el fondo floral original sin recortes de texto.
- **HU-3**: Como invitado, quiero consultar la cuenta regresiva, detalles de los lugares, cronograma del día, código de vestimenta y enviar mi confirmación RSVP indicando mi nombre, si asistiré o no, y un mensaje opcional para los novios.
- **HU-4**: Como invitado, quiero ver en el formulario de confirmación los cupos asignados a mi tarjeta y seleccionar cuántas personas asistiremos mediante una barra interactiva de opciones claras.

---

## Requisitos funcionales (criterios de aceptación en notación EARS)

- **RF-1 (Sobre Vertical a Pantalla Completa y Sello de Lacre Real)**: MIENTRAS la invitación no haya sido abierta, EL SISTEMA mostrará un sobre vertical a pantalla completa (`100vw x 100dvh`, `fixed inset-0 z-50`) con textura marfil/lino (`bg-gradient-to-b from-[#FAF7F2] via-[#EFEAE1] to-[#E3DCD0]`) y pliegue vertical lateral (`border-r border-[#C8BFB0]/60`), cuya solapa se abre tipo libro hacia la izquierda (`transform-origin: left center`, `rotateY(-165deg)`, duración `2200ms`, `cubic-bezier(0.22, 1, 0.36, 1)`) al tocar el sello de lacre físico real (`/assets/wax-seal-real.png`, `w-32 h-32` a `w-36 h-36`, `drop-shadow(0 12px 24px rgba(60, 45, 20, 0.45))`, `hover:scale-105 active:scale-95`) centrado en el eje vertical con únicamente el texto en cursiva *"Toca el sello para abrir"* debajo.

- **RF-2 (Regla de Cero Recorte Tipográfico y Fondo Floral Original)**: EL SISTEMA renderizará todos los textos caligráficos (`Great Vibes`) con color dorado sólido (`#9E7B3B`), `overflow: visible`, `line-height: 1.55`, espaciado horizontal generoso (`px-4`) y `z-index` superior sobre el fondo floral principal `/assets/bg-floral-original.jpg` (con soporte `.png`), prohibiendo el uso de `background-clip: text` o `overflow-hidden` para garantizar que ningún trazo ascendente o descendente se recorte.

- **RF-3 (Textos Oficiales de la Tarjeta Física)**: EL SISTEMA presentará en la sección principal los textos exactos en español de la tarjeta oficial:
  - Anfitriones: `"JHON ALBUS & ELIZABETH SÁNCHEZ"`
  - Subtítulo: `"Tienen el placer de invitarlos al matrimonio de"`
  - Novios: `"Valeria Albus Sánchez & Ramiro Ballestas Molina"`
  - Homenaje póstumo: `"En memoria de Rubby Molina & Ramiro Ballestas Uribe, quienes viven siempre presentes en nuestros corazones."`
  - Fecha: `"VIERNES, 11 DE DICIEMBRE DE 2026"`
  - Versículo: `"“Sus llamas son un fuego ardiente, la llama de Jah. Las aguas embravecidas no pueden extinguir el amor, ni pueden los ríos llevárselo con la corriente” (Cant. 8:6, 7)."`
  - Ciudad: `"Santa Marta, Colombia"`

- **RF-4 (Cuenta Regresiva, Recintos Oficiales, Cronograma y Código de Vestimenta por Modalidad)**: CUANDO se consulte el tiempo restante hacia `2026-12-11T17:00:00-05:00`, EL SISTEMA calculará días, horas, minutos y segundos mediante una función pura en hora local (`America/Bogota`). Para la modalidad completa (Salón + Restaurante), EL SISTEMA mostrará las secciones oficiales de Ceremonia (*"Consejos Bíblicos"* en *"Salón del Reino de Los Testigos de Jehová"*, *"Cl. 21 No. 3 A-34 Rodadero Sur"*, *"5:00 P.M."*) y Recepción (*"Recepción"* en *"Punta Brava Techo Verde"*, *"Cra. 4 No. 6-01 Rodadero"*, *"7:00 P.M."*), Cronograma ajustado (`05:00 PM` y `07:00 PM`), Código de Vestimenta (*"Damas: Vestido Largo"*, *"Caballeros: Traje y Corbata"*, sin restricción de colores reservados) y contacto RSVP por WhatsApp (`313 673 0779`, `https://wa.me/573136730779`), omitiendo la sección de *Un Detalle Especial / Lluvia de Sobres*. MIENTRAS la invitación esté en modalidad "solo Salón del Reino", EL SISTEMA mostrará únicamente la Ceremonia y la confirmación RSVP con fecha límite del 16 de noviembre de 2026, omitiendo la Recepción en Punta Brava, el cronograma y el código de vestimenta. MIENTRAS la invitación esté en modalidad "Virtual (Zoom)", EL SISTEMA mostrará las credenciales de transmisión vía Zoom y omitirá el código de vestimenta y la confirmación de asistencia física.

- **RF-5 (Utilidad de Porcentaje de Raspado en Lógica)**: EL SISTEMA mantendrá la función pura `calculateScratchPercentage` cubierta por pruebas unitarias, sin renderizar la sección visual de raspado en la invitación.

- **RF-6 (Validación y Confirmación RSVP Simplificada)**: SI el invitado intenta enviar el formulario modal RSVP sin nombre válido o sin seleccionar una de las dos opciones de asistencia (*"Sí, asistiré"* o *"No podré asistir, pero les deseo lo mejor"*), ENTONCES EL SISTEMA bloqueará el envío y mostrará un mensaje de validación claro en español sin solicitar menú ni restricciones alimentarias; CUANDO el invitado confirme *"Sí, asistiré"*, EL SISTEMA exigirá que el número de personas asistentes sea un número entero válido comprendido entre 1 y el cupo máximo asignado a su tarjeta según RF-8; CUANDO los datos sean válidos (incluyendo el número de personas asistentes y mensaje opcional para los novios), EL SISTEMA registrará la confirmación y permitirá su envío formateado.

- **RF-7 (Datos Centralizados sin UI Flotante de Configuración)**: EL SISTEMA centralizará todos los textos, horarios, lugares, opciones de menú y rutas de activos en `src/config/weddingData.js` y no renderizará ningún botón flotante ni cajón de configuración en la interfaz.

- **RF-8 (Asignación de Cupos, Enrutamiento Flexible y Selector de Asistentes en RSVP)**:
  - EL SISTEMA admitirá la identificación de la modalidad y de los cupos asignados de forma universal y sin requerir dependencias externas, reconociendo tanto rutas amigables en la dirección del navegador (como `/salon-1`, `/salon-2`, `/salon-3` para solo Salón del Reino, o `/boda-1`, `/boda-2`, `/boda-3`, `/boda-4` para la modalidad completa Salón + Restaurante), rutas con almohadilla (como `/#/salon-2`), y parámetros de búsqueda de respaldo (`?cupos=X` o `?tipo=salon&cupos=X`), de manera insensible a mayúsculas y minúsculas (por ejemplo, `/Salon-2` equivale a `/salon-2`).
  - SI se especifican simultáneamente una ruta amigable y parámetros de búsqueda, la ruta amigable tendrá prioridad y los parámetros actuarán como respaldo.
  - SI el invitado accede a la dirección raíz (`/`) o sin especificar cupos en el enlace, EL SISTEMA asignará por defecto la modalidad completa (Salón + Restaurante) con exactamente 1 cupo asignado.
  - EL SISTEMA asignará el límite máximo de cupos correspondiente: hasta 3 cupos para la modalidad solo Salón del Reino (versiones de 1, 2 y 3 cupos) y hasta 4 cupos para la modalidad completa Salón + Restaurante (versiones de 1, 2, 3 y 4 cupos). Cualquier valor no numérico, decimal o fuera de rango se normalizará de forma segura a 1 cupo.
  - CUANDO el invitado confirme asistencia con *"Sí, asistiré"*, EL SISTEMA mostrará inmediatamente debajo de la pregunta *"¿Nos acompañarás en este día especial?"* la etiqueta *"Total de personas que asistirán"* junto con una barra de selección con botones táctiles numerados desde `1` hasta el límite máximo de cupos asignado a su tarjeta (resaltando la opción seleccionada con color dorado `#9E7B3B` y preseleccionando `1`).
  - SI la tarjeta tiene asignado exactamente `1` cupo, EL SISTEMA mostrará únicamente el botón de `1` cupo preseleccionado.
  - SI la tarjeta tiene asignados `2`, `3` o `4` cupos, EL SISTEMA permitirá al invitado seleccionar libremente entre `1` y el número máximo de cupos asignados.
  - SI el invitado selecciona *"No podré asistir, pero les deseo lo mejor"*, ENTONCES EL SISTEMA ocultará la barra de selección de cupos y registrará automáticamente `0` personas asistentes; SI posteriormente el invitado vuelve a marcar *"Sí, asistiré"*, EL SISTEMA mostrará nuevamente la barra de selección restablecida en `1` persona asistente.
  - CUANDO el formulario sea enviado con datos válidos, EL SISTEMA incluirá el número de personas asistentes en el registro de confirmación.

---

## Requisitos no funcionales
- **RNF-1 (Diseño Mobile-First)**: Visualización limpia y sin desbordamiento horizontal en pantallas móviles desde `375 px` de ancho.
- **RNF-2 (Separación de Lógica e Interfaz)**: Toda regla de negocio (cálculo de cuenta regresiva, validación de RSVP, porcentaje de raspado y formateo de resumen) debe residir en funciones puras dentro de `src/logic/weddingLogic.js`, sin dependencias del DOM, y estar cubierta al 100% con `node --test`.
- **RNF-3 (Resiliencia de Activos)**: Si las fotos de los lugares o el archivo de audio aún no han sido cargados por el usuario, la interfaz mostrará contenedores de reemplazo elegantes en tonos marfil y dorado sin errores rotos en consola.

## Casos límite
- Fecha actual igual o posterior a la fecha de la boda (`isEventReached: true`): la cuenta regresiva retorna ceros sin números negativos.
- Invitado que selecciona que **no podrá asistir** (`attending: "no"`): la barra de selección de cupos no se muestra y se registra automáticamente `0` personas asistentes. Si el invitado rectifica y vuelve a seleccionar que sí asistirá, la barra reaparece restablecida con 1 persona asistente.
- Invitado que accede a la raíz (`/`) o sin cupos en el enlace: se asigna de forma segura la modalidad completa (Salón + Restaurante) con 1 cupo asignado por defecto.
- Enlace con formato no previsto, mayúsculas, valor no numérico, decimal, menor a 1 o superior al máximo de la modalidad (ej. `/Salon-9`, `/#/BODA-2`, `?cupos=0`, `?cupos=abc`): el sistema normaliza de forma segura al rango permitido (1 como mínimo; máximo 3 para solo Salón del Reino y máximo 4 para Salón + Restaurante).
- Compatibilidad hacia atrás con registros RSVP antiguos: si se procesa una confirmación previa sin el dato de personas asistentes, el sistema asume de forma segura 1 persona asistente si asistirá, o 0 si no asistirá.
- Modalidad Virtual (Zoom): no presenta barra de selección ni requiere asignación de cupos de asistencia física presencial.
- Dispositivos con bloqueo de reproducción automática de audio: la reproducción se dispara dentro del evento de clic/toque del sello de lacre y cuenta con manejo seguro de promesas (`catch`).

## Fuera de alcance
- Panel o cajón flotante de configuración en la interfaz de usuario.
- Backend externo o pasarela de pagos en línea.

## Criterios de finalización
- [x] Requisito RF-8 de asignación de cupos y selector RSVP cubierto por tests unitarios en verde (`node --test`).
- [x] Verificación de los tipos de tarjeta (1 a 3 cupos para Salón, 1 a 4 cupos para Salón + Restaurante) en vista móvil (`375 px`).
- [x] Requisitos previos RF-1 a RF-7 verificados y estables.
- [x] `MEMORY.md` actualizado con las decisiones de esta especificación.
