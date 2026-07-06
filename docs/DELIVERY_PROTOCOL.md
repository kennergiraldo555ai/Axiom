# Delivery Protocol

Al finalizar CUALQUIER Sprint, Hotfix, Refactor, Feature o Corrección, SIEMPRE se debe ejecutar este flujo completo de manera automática.

## 1. Validación de Calidad

Ejecutar los siguientes comandos obligatorios. No se puede continuar si alguno falla:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 2. Pruebas Funcionales

- Realizar todas las pruebas funcionales necesarias. No se entrega código sin probar.

## 3. Versionado (Git)

Cuando TODO funcione correctamente:

```bash
git add .
git commit -m "tipo(scope): mensaje"
```

_Mensajes profesionales siguiendo Conventional Commits (feat, fix, refactor, docs, chore)._

## 4. Despliegue

Hacer automáticamente:

```bash
git push origin master
```

(No se debe esperar a que el usuario lo pida).

## 5. Verificación de Producción

- Esperar el despliegue automático de Vercel.
- Verificar que el deployment terminó correctamente.
- Verificar que la URL de producción funciona.
- Realizar una prueba rápida sobre producción.

## 6. Informe Final Obligatorio

Al finalizar, entregar el informe con la estructura estricta definida:

- Estado del Commit (hash, mensaje)
- Vercel Deployment (Estado, Tiempo, URL)
- Producción (URL final, Resultado pruebas)
- Pruebas Funcionales (Lint, Typecheck, Build, Problemas corregidos)
- Documentación (Archivos MD creados, Arquitectura)
- Próximo Sprint Recomendado

_Regla de veracidad_: No afirmar que se hizo commit, push o verificación si hubo un impedimento técnico. Reportarlo claramente.
