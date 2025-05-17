// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";

import purgecss from "astro-purgecss";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: [
      {
        codes: ["en"],
        path: "en",
      },
      {
        codes: ["nl"],
        path: "nl",
      },
    ],
  },

  integrations: [svelte(), purgecss()],
});
