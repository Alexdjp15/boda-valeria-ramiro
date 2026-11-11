---
name: sdd
description: Úsala siempre que trabajes con Spec-Driven Development en este proyecto (docs/constitution.md o cualquier archivo dentro de specs/): redactar, revisar o cambiar specs, planes y tareas, o implementar y validar tareas de una spec.
---

# Spec-Driven Development (SDD)

## Flujo obligatorio
Constitución -> Spec -> Clarificación -> Plan -> Tareas -> Implementación -> Validación (y Cambio para mantenimiento).
- **Aprobación humana**: Nunca pases a la siguiente fase sin la aprobación explícita del usuario.
- **La spec manda**: Si algo no está en la spec activa, no se implementa. Si falta una decisión, para y pregunta al usuario.
- **Cambios de requisitos**: Un cambio se aplica primero en `spec.md`, luego en `plan.md` y `tasks.md`, y por último en el código.
- **Estructura modular**: Cada spec vive en su propia carpeta `specs/NNN-nombre/` con tres archivos: `spec.md`, `plan.md` y `tasks.md`.
- **Memoria**: Al terminar cada fase o tarea, actualiza `MEMORY.md`.

## 1. Reglas para `spec.md`
-Usa la plantilla de `specs/000-plantilla-base/spec.md`.
- La spec describe únicamente el **QUÉ** y el **POR QUÉ**. Prohibido incluir nombres de archivos, decisiones de stack o código en `spec.md`.
- Escribe todos los Requisitos Funcionales (`RF-x`) usando **notación EARS en español**:
  - `RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.`
  - `RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.`
  - `RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.`
  - `RF-x: EL SISTEMA <comportamiento permanente>.`
- Cada `RF-x` debe ser atómico (una frase = un comportamiento) y verificable (prohibido usar adjetivos vagos como "rápido", "intuitivo" o "bonito" sin una métrica concreta).

## 2. Reglas para `plan.md`
- Parte de una `spec.md` aprobada sin dudas abiertas (`[NECESITA ACLARACIÓN]`).
- Incluye: tabla de archivos y responsabilidades, firmas de funciones puras (recibiendo fecha/estado actual por parámetro), algoritmo en pseudocódigo, integración UI, decisiones técnicas justificadas con su **alternativa descartada**, y estrategia de tests con `node --test`.
- Indica explícitamente qué `RF-x` cubre cada componente y cada test.

## 3. Reglas para `tasks.md`
- Formato obligatorio:
  `- [ ] **Tn. <Descripción>.** Cubre: RF-x, RF-y — Hecho cuando: <comprobación verificable>.`
- Tareas pequeñas (máximo 20-30 minutos cada una), ordenadas por dependencia.
- Si resultan más de 10 tareas, propón al usuario dividir la spec en dos iteraciones.

## 4. Reglas para Implementación y Validación
- **Una sola tarea por turno**: Escribe primero los tests y comprueba que fallan (rojo) -> escribe el código mínimo hasta que pasen (verde) -> ejecuta `node --test` -> si hay UI, verifica con el MCP de Chrome DevTools -> marca la tarea `[x]` en `tasks.md` -> **PÁRATE**.
