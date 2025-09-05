import { defineConfig } from '@rslib/core';
import { version } from './package.json';
import path from 'path';

export default defineConfig({
  mode: 'production',
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      bundle: false,
    },
  ],
  output: {
    target: 'node',
    copy: [
      { from: '**/*.md', context: path.join(__dirname, 'src') },
      { from: '**/*.yaml', context: path.join(__dirname, 'src') },
    ],
  },
  source: {
    entry: {
      index: ['src/**', '!src/mcp/prompts/**', '!src/extractors/*.md'],
    },
    define: {
      'process.env.NPM_PACKAGE_VERSION': JSON.stringify(version),
    }
  }
});