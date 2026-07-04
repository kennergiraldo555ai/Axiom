# AXIOM Project Permanent Guidelines

## Filosofía de Diseño Permanente

Toda interfaz futura deberá transmitir las siguientes sensaciones: Profesional, Elegante, Moderna, Tecnológica, Minimalista, Muy limpia, Rápida, Premium.
Nunca deberá sentirse como un dashboard genérico. El usuario debe percibir inmediatamente que está utilizando un software de alta calidad.

## Lineamientos Visuales Permanentes

Aplicar en todas las pantallas del proyecto:

- Dark Mode como único modo durante el MVP.
- Tipografía única: Inter.
- Paleta principal basada en morados y azules. Acentos únicamente donde realmente aporten jerarquía.
- Bordes redondeados consistentes.
- Espaciado basado en múltiplos de 8 px.
- Sombras muy suaves, alto contraste, mucho espacio en blanco.
- Iconografía consistente (Lucide).
- Animaciones discretas.
- Skeletons antes que spinners.
- Jerarquía visual muy clara.

Inspiración: Linear, Stripe, Raycast, Notion, Vercel, Apple. No copiar interfaces, tomar principios.

## Reutilización

Antes de crear un componente nuevo: Buscar si ya existe uno reutilizable en `src/modules/_shared/components/`.
Si puede extenderse: Extiéndelo. No dupliques componentes, estilos o lógica.

## Experiencia de Usuario (UX)

Toda interacción debe sentirse inmediata.
Priorizar: Skeletons, Transiciones suaves, Feedback instantáneo, Estados vacíos útiles, Errores explicativos, Acciones claras.
Nunca dejar al usuario preguntándose qué ocurrió.

## Revisión Obligatoria (Fin de Sprint)

Antes de cerrar cualquier Sprint con interfaz gráfica, realiza tres revisiones adicionales y documéntalas en `walkthrough.md`:

1. UX Review (Claridad, Flujo, Jerarquía, Consistencia, Accesibilidad, Velocidad percibida)
2. Design Review (Espaciado, Tipografía, Colores, Contraste, Componentes, Responsive, Microinteracciones)
3. Performance Review (Server Components, Client Components, Bundle, Renders, Lazy Loading, Streaming, Optimización)

## Despliegue Obligatorio (Fin de Sprint)

Al finalizar el Sprint:

1. Ejecutar: `pnpm lint`, `pnpm typecheck`, `pnpm build`
2. Realizar commit y Push a master.
3. Esperar el despliegue automático de Vercel y verificar la aplicación en producción.
4. Entregar la URL pública definitiva y confirmar que el flujo principal funciona correctamente.
   Solo entonces podrá darse por finalizado el Sprint.
