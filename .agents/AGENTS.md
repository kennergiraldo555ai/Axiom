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
4. Product Review (¿Qué sensación transmite? ¿Qué tan cerca de Enterprise? ¿Qué parece MVP? ¿Qué parece terminado? ¿Qué mejoraría Linear/Stripe?)

## Despliegue Obligatorio (Fin de Sprint)

Al finalizar el Sprint:

1. Ejecutar: `pnpm lint`, `pnpm typecheck`, `pnpm build`
2. Realizar commit y Push a master.
3. Esperar el despliegue automático de Vercel y verificar la aplicación en producción.
4. Entregar la URL pública definitiva y confirmar que el flujo principal funciona correctamente.
   Solo entonces podrá darse por finalizado el Sprint.

## Reglas de Producto y Nomenclatura Permanente

1. **AXIOM no es un Dashboard:** Es un motor de inteligencia comercial. Cada pantalla debe responder preguntas clave de negocio (ej. "¿A quién debería venderle?", "¿Cuál es el siguiente negocio al que debo venderle?").
2. **Jerarquía Visual Estricta:** Los datos de negocio importan más que los técnicos. El Score, Prioridad, y Acciones Recomendadas deben ser protagonistas por encima de IDs, direcciones o hashes.
3. **La IA es Protagonista:** El análisis de IA no puede ser texto plano. Debe estructurarse claramente en: Resumen, Fortalezas, Problemas, Oportunidades, Servicios recomendados, Prioridad, Probabilidad de cierre, Próximo paso.
4. **Nomenclatura (Cero Barberías):** Prohibido usar "Barberías" en código (salvo ejemplos locales). Todo se llama: `Business`, `Prospect`, `Lead`, `Opportunity`, `Industry`, `Business Category`, `Solution`, `Service Recommendation`.
5. **Navegación Impecable:** El usuario nunca debe sentirse perdido. Siempre debe haber visible: Estado actual, Próximo paso, Acción principal y Acción secundaria.
