import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    // The legacy src/ tree carries Create React App tests that no runner here
    // can execute; the suites below cover the current app/, components/ and lib/.
    include: ["{app,components,lib,store}/**/*.test.{ts,tsx}"],
  },
});
