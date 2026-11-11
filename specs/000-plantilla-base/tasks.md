# Tareas de Implementación - Spec 000: [Nombre de la Funcionalidad]
Regla: Máximo 20-30 min por tarea, en orden de dependencia. Implementar UNA sola tarea a la vez aplicando TDD (test en rojo -> código -> test en verde -> parar).

- [ ] **T1. Crear funciones puras de validación y cálculo base.** Cubre: `RF-1`, `RF-2`
  - Hecho cuando: `tests/feature.test.js` incluye las pruebas para `RF-1` y `RF-2` y la ejecución de `node --test` pasa 100% en verde.

- [ ] **T2. Cubrir casos límite de dominio (vacíos, duplicados y bordes).** Cubre: `RF-4`
  - Hecho cuando: Los tests de casos límite están implementados en `tests/feature.test.js` y `node --test` pasa en verde sin regresiones.

- [ ] **T3. Conectar lógica con la interfaz de usuario y estilos responsive.** Cubre: `RF-3`, `RNF-1`
  - Hecho cuando: La interfaz muestra e interactúa con los datos correctamente, la consola en Chrome DevTools no arroja errores y la vista móvil (`375 px`) se visualiza correctamente.
