# Spec 000 - [Nombre de la Funcionalidad]
Estado: borrador | aprobada | implementada

## Contexto y objetivo
<Explica en un párrafo qué problema resuelve esta funcionalidad y por qué aporta valor al usuario.>

## Usuarios / actores
<Quién utiliza esta funcionalidad y en qué contexto.>

## Historias de usuario
- **HU-1**: Como `<rol>`, quiero `<acción>` para `<beneficio>`.
- **HU-2**: Como `<rol>`, quiero `<acción>` para `<beneficio>`.

## Definiciones
<Opcional: incluye solo términos de dominio que puedan interpretarse de varias formas.>

## Requisitos funcionales (criterios de aceptación en notación EARS)
- **RF-1 (Evento)**: CUANDO `<evento disparador>`, EL SISTEMA `<respuesta medible y verificable>`.
- **RF-2 (Error / Condición no deseada)**: SI `<condición inválida o fallo>`, ENTONCES EL SISTEMA `<respuesta de protección o mensaje claro>`.
- **RF-3 (Estado)**: MIENTRAS `<el sistema esté en determinado estado>`, EL SISTEMA `<comportamiento activo>`.
- **RF-4 (Permanente)**: EL SISTEMA `<regla o comportamiento constante en todo momento>`.

## Requisitos no funcionales
- **RNF-1 (Diseño / Móvil)**: La interfaz debe visualizarse sin desbordamientos horizontales en pantallas móviles de `375 px` de ancho.
- **RNF-2 (Rendimiento / Accesibilidad)**: `<Criterio medible de carga, contraste o navegación por teclado>`.

## Casos límite
- Datos vacíos o estado inicial sin registros previos.
- Entradas duplicadas, valores extremos o formatos corruptos.
- Operaciones en límites de fecha/hora (ej. medianoche `00:00` o cambios de hora).

## Fuera de alcance
- `<Lo que explícitamente NO se construirá en esta iteración para evitar sobreingeniería>`.

## Criterios de finalización
- [ ] Todos los `RF-x` de lógica cubiertos por tests unitarios en verde (`node --test`).
- [ ] Todos los `RF-x` y `RNF-x` de interfaz verificados con el MCP de Chrome DevTools (consola limpia + captura móvil `375 px`).
- [ ] `MEMORY.md` actualizado con las decisiones de esta especificación.

## Dudas abiertas
- [NECESITA ACLARACIÓN] `<Pregunta concreta para el usuario antes de aprobar la spec>`
