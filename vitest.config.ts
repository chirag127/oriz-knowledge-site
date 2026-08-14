/// <reference types="vitest" />
import { getViteConfig } from 'astro/config'

// Astro-aware Vitest config: getViteConfig resolves astro:content + .astro
// components and enables the Container API. root pinned to this dir so a
// stray parent vitest.config can't hijack resolution.
export default getViteConfig({
  root: __dirname,
  test: {
    include: ['test/**/*.test.ts'],
  },
})
