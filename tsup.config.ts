import {defineConfig} from 'tsup';
import fs from 'fs/promises';
import path from 'path';

const entry = 'src/index.ts';
const outDir = 'dist';

const common = defineConfig({
  entryPoints: [entry],
  format: ['esm', 'cjs'],
  treeshake: true,
  sourcemap: true,
});

export default defineConfig([
  {
    ...common,
    env: {NODE_ENV: 'development'},
    outDir: path.join(outDir, 'development'),
  },
  {
    ...common,
    env: {NODE_ENV: 'production'},
    dts: entry,
    outDir: path.join(outDir, 'production'),
    minify: true,
    async onSuccess() {
      await fs.writeFile(
        path.resolve(process.cwd(), outDir, 'index.cjs'),
        `module.exports = process.env.NODE_ENV === 'development' ? require('./development/index.cjs') : require('./production/index.cjs');`,
        'utf-8',
      );
    },
  },
]);