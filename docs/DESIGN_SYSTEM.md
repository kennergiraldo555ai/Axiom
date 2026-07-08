# AXIOM Design System

Este documento establece las pautas visuales definitivas (fuente única de verdad) para la interfaz de AXIOM, basadas en la imagen de branding oficial (Sprint UI Enterprise v1).

## 1. Filosofía

- **Enterprise Premium:** Todo debe sentirse como software de alta calidad (Stripe, Linear, Vercel, Notion).
- **Minimalismo y Contraste:** Uso generoso del espacio en blanco (dark space), sombras suaves y contrastes marcados para la tipografía principal.
- **Micro-animaciones:** Todas las transiciones (hover, active) deben ser fluidas y naturales (300ms, scale).

## 2. Tipografía

- **Principal:** Inter (Google Fonts).
- Se utiliza tracking ajustado (`tracking-tight`) para los encabezados.
- Se utiliza `font-mono` (`ui-monospace, SFMono-Regular`) para scores y valores numéricos crudos.

## 3. Paleta de Colores

Las variables están definidas en `src/app/globals.css` y `src/styles/tokens.css`.

- **Fondo:** Dark mode nativo (`#09090b` / `zinc-950` como base).
- **Acento (Primario):** Violeta a Cyan (`bg-gradient-to-r from-violet-500 to-cyan-400`).
- **Superficies:** Paneles "Glassmorphism" con `backdrop-blur-md` y bg con opacidad.
- **Bordes:** Muy sutiles (`border-white/10`) para dividir las áreas lógicas.

## 4. Componentes Clave

- **Button:**
  - Scale down en `active:scale-[0.95]`.
  - Hover transitions de sombra y color (`duration-300`).
- **Card:**
  - Radios pronunciados (`rounded-2xl` o `var(--r-2xl)`).
  - Variantes: `default`, `premium`, `glass`, `metric`.
- **Badge:**
  - Variantes `premium` y `ai` con padding ajustado (`px-2.5 py-0.5`).
- **Input & Search:**
  - Formato "Spotlight": `backdrop-blur-md`, padding interior generoso, shadow-premium en focus-within.

## 5. Reglas Permanentes de Implementación

1. **No usar colores crudos:** Siempre usar tokens `var(--c-...)`.
2. **Reutilización:** Si necesitas un componente interactivo, revisa `src/modules/_shared/components/` primero.
3. **Escalabilidad Visual:** Piensa en estados vacíos, loading (shimmer) y errores antes de implementar el estado "ideal".
4. **Estado Inicial Limpio:** La caché nunca debe modificar la experiencia inicial del usuario. La pantalla inicial siempre debe representar un estado limpio (Empty State).
5. **Historial vs Caché:** Son conceptos distintos. El caché se usa para acelerar una búsqueda, no para poblar automáticamente el UI sin interacción del usuario.
