import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, ["node_modules/astro/astro.js", "build"], {
  env: { ...process.env, AGENCY_LOCAL_DEMO: "1", ASTRO_TELEMETRY_DISABLED: "1" },
  stdio: "inherit",
});
process.exit(result.status ?? 1);
