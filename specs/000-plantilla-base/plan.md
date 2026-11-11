# Plan Técnico - Spec 000: [Nombre de la Funcionalidad]

## 1. Archivos y responsabilidades
| Archivo | Acción (Crear / Modificar) | Responsabilidad única | RF cubiertos |
| :--- | :--- | :--- | :--- |
| `src/logic/feature.js` | Crear | Funciones puras de cálculo y validación (sin DOM ni storage) | RF-1, RF-2 |
| `src/ui/feature-view.js` | Crear / Modificar | Renderizado en interfaz y captura de eventos del usuario | RF-3, RF-4 |
| `tests/feature.test.js` | Crear | Pruebas unitarias automatizadas con `node --test` | RF-1, RF-2, RF-4 |

## 2. Funciones puras de lógica
- `calculateFeatureResult(items, currentDate)`:
  - **Entrada**: Array de datos validados y fecha local actual (`"AAAA-MM-DD"`) pasada como parámetro.
  - **Salida**: Objeto determinista con el resultado calculado.
  - **RF cubiertos**: RF-1, RF-2.

## 3. Algoritmo en pseudocódigo
```text
FUNCIÓN calculateFeatureResult(items, currentDate):
  SI items no es válido O está vacío:
    RETORNAR estado inicial por defecto (RF-2)
  FILTRAR items que cumplan condición respecto a currentDate
  CALCULAR métrica principal
  RETORNAR resultado estructurado (RF-1)
```

## 4. Integración en la interfaz (UI)
- Cómo se inyectan los datos en el DOM/componente sin acoplar la lógica.
- Comportamiento adaptable para escritorio y móvil (`375 px`).

## 5. Decisiones técnicas justificadas
- **Decisión 1**: Pasar `currentDate` como argumento a todas las funciones de negocio.
  - *Por qué*: Hace que las pruebas sean 100% deterministas sin depender del reloj del sistema.
  - *Alternativa descartada*: Instanciar `new Date()` dentro de la función (dificulta testear casos límite de fechas).

## 6. Estrategia de pruebas (`node --test` + Chrome DevTools)
- **Tests unitarios (`node --test`)**:
  - Test 1: Caso feliz para `RF-1`.
  - Test 2: Manejo de entradas inválidas o vacías para `RF-2`.
  - Test 3: Casos límite (fechas, duplicados) para `RF-4`.
- **Verificación en navegador (MCP `chrome-devtools`)**:
  - Flujo interactivo para `RF-3`, revisión de consola sin errores y captura responsive en `375 px`.
