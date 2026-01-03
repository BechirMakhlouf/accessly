import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.cjs',
  platform: 'node',
  target: 'node25',
  format: 'cjs',
  sourcemap: true,
  logLevel: 'info',
  tsconfig: 'tsconfig.json',
}).catch(() => {
  process.exit(1);
});
