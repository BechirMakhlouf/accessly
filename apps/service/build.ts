import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.cjs',
  platform: 'node',
  // outdir: "dist",
  target: 'node25',
  format: 'cjs',
  sourcemap: true,
  logLevel: 'info',
});
