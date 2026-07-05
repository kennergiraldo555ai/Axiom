# AXIOM Deployment & CI/CD Rules

Este documento establece las reglas permanentes para los despliegues en producción (Vercel) y cualquier integración continua (CI/CD) de AXIOM.

## 1. Fase de Build (Next.js)

**Contexto:** Los builds en Vercel pueden fallar si las dependencias auto-generadas (como Prisma) no están sincronizadas con el código actual.
✅ **HACER:** Asegurarse de que el comando de build ejecute siempre cualquier paso de generación de código ANTES de invocar el compilador.

```json
"build": "prisma generate && next build"
```

❌ **NUNCA HACER:** Depender exclusivamente de los scripts `postinstall` en entornos cacheados como Vercel, ya que si `package.json` no detecta cambios en las versiones, npm/pnpm/yarn omitirán el `postinstall`, usando un cliente cacheado obsoleto.

## 2. Variables de Entorno

**Contexto:** Vercel utiliza las variables configuradas en su panel, las cuales inyecta en el build.
✅ **HACER:** Cualquier nueva variable de entorno agregada al proyecto (ej. nuevas claves de Supabase, APIs de terceros) debe ser documentada, y el responsable debe asegurarse de que la misma se haya configurado en el panel de Vercel ANTES del siguiente Push.
❌ **NUNCA HACER:** Hacer push de características que requieran nuevas variables de entorno sin antes haberlas aprovisionado en Vercel. Esto romperá el build de Next.js (ya que evalúa variables de entorno de servidor estáticamente).

## 3. Caché de Vercel

**Contexto:** Vercel guarda la caché de compilación en `.next/cache` y dependencias en `node_modules`.
✅ **HACER:** En caso de errores fantasmas durante despliegues (ej. clases CSS de Tailwind que no aplican, o errores de módulo no exportado de paquetes locales), despliega con la opción **"Redeploy sin Caché" (Redeploy without existing cache)** en el panel de Vercel.

## 4. Auditorías de Modelos (Prisma/BD)

**Contexto:** Un cambio en la BD (ej. nuevo Enum) que rompa el build suele ser debido a que TypeScript está evaluando código que asume que el cambio existe, pero el cliente autogenerado cacheado no lo tiene.
✅ **HACER:** Siempre verificar que el código no solo compile localmente (donde el caché de Prisma se renueva activamente), sino garantizando que el build script reconstruya ese cliente.
