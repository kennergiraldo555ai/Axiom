# AXIOM Component Library

Nuestra librería de componentes compartidos reside en `src/modules/_shared/components/`.

## Filosofía

- **Agnósticos al dominio**: Ningún componente aquí debe saber de "Prospectos", "CRM" o "IA".
- **Basados en CVA (Class Variance Authority)**: Para facilitar el uso de variantes.
- **Glassmorphism y Premium Feel**: Por defecto, los componentes usan las paletas `--c-bg-subtle` y `--c-border-subtle`.

## Catálogo Principal

- `Button.tsx`: Botones con `variant="premium"`, `default`, `outline`, etc. Incluye `active:scale`.
- `Input.tsx`: Campo de texto estandarizado con manejo de errores y estados `focus-within`.
- `Card.tsx`: Contenedor base para la mayoría de layouts (variantes `premium`, `glass`, `metric`).
- `Badge.tsx`: Etiquetas para estados (Ej: `variant="ai"`, `variant="success"`).
- `EmptyState.tsx`: Estado vacío elegante para pantallas sin datos, con glow effect.
- `Skeleton.tsx`: Efecto shimmer base.
- `GlassContainer.tsx` / `GradientBorder.tsx`: Utilidades para layouts avanzados.
- `SearchBar.tsx`: Wrapper estilizado para formularios horizontales.
- `CityAutocomplete.tsx`: Input conectado a la API de OpenMeteo para geocodificación en todo el SaaS.
