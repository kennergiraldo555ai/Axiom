# AXIOM UI Guidelines

## 1. Experiencia Inicial

- **Nunca cargar datos automáticamente en el primer render.** El usuario siempre debe encontrarse con un estado inicial limpio.
- La caché existe para responder rápido cuando el usuario realiza una acción, no para asumir qué quiere ver el usuario antes de que interactúe.

## 2. Empty States

- Los estados vacíos deben ser informativos y elegantes.
- Utilizar el componente `EmptyState` compartido (`src/modules/_shared/components/EmptyState.tsx`).
- Incluir un ícono sutil, texto explicativo y opcionalmente llamadas a la acción que inviten a usar el módulo.

## 3. Loading States

- Prohibidos los `spinners` genéricos en el layout principal.
- Utilizar _Grid Skeletons_ o _List Skeletons_ que emulen la estructura de la información que va a cargarse.
- Los skeletons deben usar la misma paleta y bordes que las cards correspondientes.

## 4. Formularios y Búsqueda

- Los inputs deben ser visualmente prominentes (`h-10`, `text-sm`, `rounded-md`).
- Focus states deben utilizar un `ring-2` con el color de acento (`var(--c-accent)`).
- Evitar componentes nativos poco estéticos como `datalist`. Reemplazar con UIs controladas (como popovers) o depender del placeholder + autocompletado nativo discreto.
