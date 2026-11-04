import { defineConfig } from 'astro/config';
const base = process.env.SAMVAD_BASE_PATH || '/samvad-design-system/';
if (!base.startsWith('/') || base.includes('..') || /[?#]/.test(base)) throw new Error('SAMVAD_BASE_PATH must be a root or repository path.');
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  base,
  site: process.env.SAMVAD_SITE_URL || 'https://hanufaislam.github.io',
  outDir: process.env.SAMVAD_OUTPUT_DIR || './dist/',
  devToolbar: { enabled: false },
});
