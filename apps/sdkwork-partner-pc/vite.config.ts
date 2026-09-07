import { resolveViteEnvironment, resolveLucideReactEntry } from '../../../sdkwork-specs/tools/vite-runtime-profile.mjs';
import { resolveBrowserDistOutDir } from '../../../sdkwork-specs/tools/browser-dist-layout.mjs';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  build: {
    outDir: resolveBrowserDistOutDir(resolveViteEnvironment(undefined, process.env)),
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5186,
  },
});
