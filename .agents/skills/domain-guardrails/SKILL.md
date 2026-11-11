---
name: domain-guardrails
description: Úsala siempre que escribas, modifiques o revises lógica de negocio, manejo de fechas locales, persistencia de datos o validaciones críticas del dominio.
---

# Guardarraíles de Dominio y Prevención de Bugs

Sigue esta guía siempre que toques lógica sensible del proyecto para evitar los errores más frecuentes de los LLM.

## 1. Manejo seguro de fechas locales (si el proyecto usa fechas)
- Las fechas de día se almacenan como texto `"AAAA-MM-DD"` en la zona horaria local del usuario.
- Para obtener la fecha de hoy, constrúyela con `getFullYear()`, `getMonth() + 1` y `getDate()` rellenando con ceros (`padStart(2, '0')`).
- Para convertir `"AAAA-MM-DD"` en objeto `Date`, usa `new Date(year, month - 1, day)`. **Nunca uses `new Date("AAAA-MM-DD")`** porque JavaScript lo interpreta en UTC y desplaza el día en zonas horarias negativas (como Colombia UTC-5).
- **Nunca uses `toISOString()`** para extraer la fecha del usuario: devuelve siempre UTC.
- Para sumar o restar días, usa `setDate(getDate() ± n)`, nunca sumes ni restes `86400000` milisegundos.

## 2. Funciones puras e inmutabilidad
- Ninguna función de cálculo debe leer directamente de `localStorage`, base de datos, variables globales ni del DOM.
- Toda función dependiente del tiempo debe recibir `today` (`"AAAA-MM-DD"`) como parámetro para poder probarse en cualquier fecha desde `node --test`.
- No mutes arrays ni objetos de entrada; devuelve copias nuevas.

## 3. Compatibilidad de datos
- Si una nueva spec modifica la estructura de los datos guardados, incluye una función de migración o valores por defecto para no romper los datos previos del usuario.

## Checklist obligatorio al terminar
- [ ] ¿Se evitó por completo `toISOString()` y `new Date("AAAA-MM-DD")`?
- [ ] ¿Las funciones de lógica son 100% puras y reciben sus dependencias por parámetro?
- [ ] ¿Se mantienen intactos los datos previos del usuario?
- [ ] ¿Se probaron entradas vacías, nulas y casos límite en `node --test`?
