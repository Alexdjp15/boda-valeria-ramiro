---
description: SDD - Genera el plan técnico de una spec aprobada
agent: plan
---
Lee `docs/constitution.md`, `AGENTS.md` y `specs/$1/spec.md`. Usa la skill `sdd` y `domain-guardrails`.
NO escribas código fuente.

Si la spec no está aprobada o tiene dudas abiertas (`[NECESITA ACLARACIÓN]`), para y avísame.
Si está lista, genera `specs/$1/plan.md` con:
1. Archivos que se crean o modifican y la responsabilidad única de cada uno.
2. Funciones puras de lógica (recibiendo fecha o estado actual como parámetro).
3. Algoritmo principal en pseudocódigo.
4. Cómo se integra y pinta en la interfaz.
5. Decisiones técnicas justificadas (indicando su alternativa descartada).
6. Estrategia de tests con `node --test` y verificación visual con Chrome DevTools.

Todo debe respetar `docs/constitution.md` y cubrir todos los `RF-x`. Marca qué `RF-x` cubre cada parte.
