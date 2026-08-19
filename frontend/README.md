# Blue Team Asset Console

A React/Vite blue-team console for the existing SOC asset management project. It gives defenders a focused view of asset coverage, monitored infrastructure, and triage status while mirroring the fields in `project.py` and the JSON records in `../asset1/` without modifying the Python CLI.

## Run

```bash
npm install
npm run dev
```

The current UI seeds itself from the existing sample records and stores newly registered assets in browser `localStorage`. A future Express API can replace `loadAssets` and `addAsset` in `src/main.jsx` without changing the Python flow.
