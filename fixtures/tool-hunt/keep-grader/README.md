# KEEP channel grader — thin public UI

Static demo of Never86 channel KEEP$ rank (love→buy-now wedge).

**Not forecasting.** Math mirrors `scripts/keep-channel-grader.mjs` + `services/pain-leads-api/src/lib/keepChannelGrade.ts`.

## Serve

```bash
python3 -m http.server 5180 --bind 0.0.0.0 --directory fixtures/tool-hunt/keep-grader
# open http://127.0.0.1:5180/
```

## Validate

```bash
node scripts/validate-keep-grader-ui.mjs
```

Preset: Girl & The Goat sample month (CHI) — DoorDash/Uber fee leak vs Shop ~6% buy-now.
