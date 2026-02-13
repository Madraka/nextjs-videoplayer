import { defineConfig } from 'tsup';
import path from 'path';
import type { BuildOptions } from 'esbuild';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    compilerOptions: {
      incremental: false,
      tsBuildInfoFile: undefined
    }
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-progress',
    '@radix-ui/react-select',
    '@radix-ui/react-slider',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-tooltip'
  ],
  banner: {
    js: '"use client";',
  },
  define: {
    __PLAYER_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
  },
  esbuildOptions(options: BuildOptions) {
    options.jsx = 'automatic';
    options.alias = {
      '@': path.resolve('./src'),
    };
  },
});
