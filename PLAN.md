# PLAN.md — Mundial 2026 IA Predictor

Plan de implementación por fases. Objetivo: app en Next.js que recalcula a diario y proyecta todos los mercados estadísticos por partido, lista para grabar contenido.

---

## Arquitectura general

```
Cron diario
   -> Ingesta de data (API-Football)
   -> Normaliza y guarda en SQLite
   -> Corre el modelo de predicción
   -> Guarda predicciones con timestamp
   -> Dashboard (Next.js) lee de SQLite y renderiza
```

Tres capas separadas: ingesta (data cruda), modelo (math puro, sin red), presentación (UI). El modelo nunca llama a la API; solo consume lo que ya está en DB. Esto lo hace testeable y rápido.

---

## Fuentes de datos

1. **API-Football (RapidAPI)** — recomendada. Tiene fixtures, resultados en vivo, lineups, eventos (goles, tarjetas, minuto), estadísticas por partido (corners, shots, posesión) y stats por jugador. Plan free: 100 requests/día.
2. **football-data.org** — free, buena para fixtures y resultados, sirve de fallback.

---

## Mercados que proyecta el modelo

- **Resultado 1X2**: gana local / empate / gana visitante.
- **Doble oportunidad**: 1X, 12, X2.
- **Over/Under goles**: líneas 1.5, 2.5, 3.5.
- **BTTS** (ambos marcan): sí / no.
- **Marcador exacto**: top 5 marcadores más probables.
- **Goleador**: primer goleador y goleador en cualquier momento.
- **Total de tarjetas**: over/under 3.5, probabilidad de roja.
- **Corners**: over/under (línea dinámica).
- **Clean sheet / gana a cero**.
- **Torneo**: clasificados por grupo, proyección de campeón, Bota de Oro.

---

## El modelo (lib/model/)

- **Base**: distribución de Poisson sobre goles esperados (xG). Estándar de la industria para proyectar goles, BTTS, over/under y marcador exacto.
- **Lambda (goles esperados)**: fuerza ofensiva del equipo, fuerza defensiva del rival, ranking FIFA, forma reciente (últimos 5-10 partidos), ventaja de sede.
- **Tarjetas y corners**: regresión sobre promedios históricos ajustada por intensidad del partido.
- **Goleadores**: reparte el lambda del equipo entre jugadores según goles por minuto histórico.
- **Campeón / Bota de Oro**: Monte Carlo — correr el torneo 10.000 veces y contar frecuencias.

---

## Fases

### Fase 0 — Setup ✅
- create-next-app con TS, Tailwind, App Router.
- shadcn/ui init, Recharts, better-sqlite3, vitest.
- Estructura: app/, lib/data/, lib/model/, lib/db/, scripts/cron.ts.
- .env.example con RAPIDAPI_KEY.

### Fase 1 — Ingesta y DB ✅
- Schema SQLite: teams, players, fixtures, match_events, match_stats, predictions, montecarlo_cache.
- Cliente de API-Football con retry y cache (lib/api/football.ts).
- Seed de los 12 grupos y 48 equipos del Mundial 2026, 72 partidos de fase de grupos.

### Fase 2 — Modelo de predicción ✅
- lib/model/poisson.ts: goles esperados -> matriz de probabilidad de marcadores.
- lib/model/cards.ts, corners.ts, scorers.ts.
- lib/model/montecarlo.ts: simulación completa del torneo (10k iteraciones).
- lib/model/predict.ts: todos los mercados del PLAN.
- 16 tests con vitest, 0 fallos.

### Fase 3 — Cron diario ✅
- scripts/cron.ts: trae resultados nuevos, actualiza forma, recalcula predicciones.
- Local: tsx scripts/cron.ts. Deploy: Vercel Cron (5am UTC diario, vercel.json).

### Fase 4 — Dashboard ✅
- Home: proyección de campeón (Monte Carlo top 8) + grid de grupos.
- /grupo/[id]: tabla proyectada de clasificación (5k simulaciones) + partidos.
- /partido/[id]: todos los mercados en cards, diseño broadcast oscuro.

### Fase 5 — Pulido y deploy ✅
- Animaciones con framer-motion (FadeIn, AnimatedProbBar, AnimatedNumber).
- Banner: "Análisis estadístico de entretenimiento. No es asesoría de apuestas."
- vercel.json con Cron configurado (5am UTC).
- Modo captura: /captura/partido/[id]?mercado=resultado|goles|marcadores — vista 1080x1080 para clips de Instagram.

---

## Modo captura (Instagram)

```
/captura/partido/[id]?mercado=resultado    # barras de probabilidad
/captura/partido/[id]?mercado=goles        # xG + over/under
/captura/partido/[id]?mercado=marcadores   # top 6 marcadores más probables
```

---

## Deploy a Vercel

```bash
pnpm add -g vercel
vercel login
vercel --prod
```

Variables de entorno en Vercel:
- RAPIDAPI_KEY
- CRON_SECRET
- DATABASE_URL (si se usa Postgres en producción)

Nota: better-sqlite3 funciona en Vercel con Node.js runtime.
Vercel Cron ejecuta /api/cron a las 5am UTC con header x-cron-secret.

---

## Riesgos

- **Límite API free**: el cron diario con cache lo respeta. Para data en vivo durante partidos hay que pasar a plan pago.
- **Calidad de predicciones**: Poisson es sólido para goles, más ruidoso para tarjetas/corners. Mostrar confianza baja en esos mercados.
- **Legal**: mientras la app solo muestre probabilidades y no reciba dinero, es análisis estadístico.
