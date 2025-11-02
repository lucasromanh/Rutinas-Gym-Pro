# Rutina Gym Pro

Aplicación PWA fitness construida con **React 19 + TypeScript + Vite**. Rutina ofrece onboarding inteligente, rutinas dinámicas, seguimiento de progreso y una UI moderna basada en TailwindCSS + shadcn/ui.

## Características principales

- Onboarding guiado (altura, peso, objetivo, nivel, foco muscular y 1RM aproximada).
- Rutinas precargadas segmentadas por objetivo y nivel.
- Editor de entrenamientos personalizados con guardado en `localStorage`.
- Contextos globales para usuario, rutinas, tema claro/oscuro y registro de progreso.
- Dashboard con métricas clave (IMC, volumen levantado, racha semanal) y gráficos con Recharts.
- Navegación inferior estilo app móvil y animaciones `framer-motion`.
- Modo PWA completo: `manifest.json`, `sw.js` y registro automático del service worker.
- Mock endpoints (`/public/mock`) para futura sincronización con backend PHP/MySQL en Hostinger.

## Estructura relevante

- `src/components/ui`: Adaptaciones de componentes shadcn/ui (Card, Button, Tabs, etc.).
- `src/components/charts`: Visualizaciones reutilizables (`ProgressRing`, `WeeklyVolumeChart`).
- `src/context`: Providers (`ThemeProvider`, `UserProvider`, `WorkoutProvider`).
- `src/pages`: Pantallas principales (`HomePage`, `WorkoutsPage`, `StatsPage`, etc.).
- `src/data`: Rutinas base, selector inteligente y librería de ejercicios.
- `src/utils`: Utilidades para IMC, 1RM y persistencia en `localStorage`.
- `src/pwa`: Registro del service worker.

## Scripts

- `npm run dev`: Inicia el entorno de desarrollo con Vite.
- `npm run build`: Genera el build optimizado (`dist`).
- `npm run preview`: Sirve el build para verificación local.
- `npm run lint`: Ejecuta ESLint.

## Configuración de Tailwind

Tailwind está configurado en `tailwind.config.js` con los colores de marca (`#4253ff`) y la tipografía Inter. Se incluye el plugin `tailwindcss-animate` requerido por los componentes shadcn.

## PWA y despliegue

- El `manifest.json` define colores, nombre de la app y tamaños de iconos (colocar iconos definitivos en `public/icons`).
- `src/sw.js` implementa caché básico con estrategia cache-first.
- Para desplegar en Hostinger sirve los archivos de `dist/`, asegurando que `sw.js` y `manifest.json` estén en la raíz pública.
- Los endpoints mock en `public/mock` permiten probar sincronización hasta que se conecte el backend real.

## Próximos pasos sugeridos

1. Reemplazar iconos placeholders en `public/icons/`.
2. Ampliar `exercises.json` con los 500+ ejercicios definitivos.
3. Conectar los mock endpoints con un backend PHP/MySQL real.
4. Añadir pruebas unitarias (React Testing Library) para los contextos críticos.
