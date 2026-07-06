# AXIOM Delivery Protocol

## Política Obligatoria de Finalización de Sprints

Queda **estrictamente prohibido** finalizar un Sprint o tarea únicamente porque los comandos locales (`pnpm build`, `pnpm lint`, `pnpm typecheck`) pasaron exitosamente. El éxito local no garantiza el despliegue en producción.

Un Sprint solo se considera **FINALIZADO** cuando se cumplen de forma verificable y automatizada TODOS los siguientes puntos:

1. El commit fue realizado correctamente (utilizando Conventional Commits).
2. El commit fue subido a GitHub (`git push`).
3. GitHub refleja correctamente la rama y el commit esperado.
4. Vercel terminó **completamente** el despliegue.
5. GitHub y Vercel muestran **exactamente el mismo hash** de commit.
6. La URL de producción responde correctamente (HTTP 200).
7. Se verificó que la producción corresponde al último commit.
8. El agente/desarrollador indica **explícitamente** si el usuario YA puede comenzar las pruebas manuales.

## Procedimiento de Auditoría Final

Antes de notificar al usuario que la tarea terminó, el agente deberá:

- Consultar el estado del deploy mediante Vercel CLI o API.
- Confirmar el match exacto del hash de git local vs. Vercel.
- Validar las variables de entorno productivas (`DATABASE_URL`, `DIRECT_URL`).
- Entregar un **Informe Final Obligatorio** que exponga todas estas métricas de verificación.
