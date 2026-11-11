---
description: SDD - Nuevo requisito o cambio (primero la spec, luego el código)
agent: plan
---
Nuevo requisito o cambio para la spec `specs/$1/`: $ARGUMENTS
NO toques código. Usa la skill `sdd`.
1. Actualiza `specs/$1/spec.md`: añade el nuevo `RF-x` (o modifica el existente) en notación EARS, sus casos límite y lo que queda fuera de alcance.
2. Indica qué partes de `plan.md` y `tasks.md` habría que actualizar después.
3. Muéstrame el diff de `spec.md` y espera mi aprobación.
