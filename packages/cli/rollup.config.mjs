import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

const EXTERNALS = [
  '@latitude-data/sdk',
  'commander',
  'fs',
  'fs/promises',
  'inquirer',
  'os',
  'path',
  'readline',
  'glob',
  'chalk',
  'child_process',
  'crypto',
  'fast-sha256',
  'keytar'
]

const config = [
  // CLI Tool - ESM only
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
      banner: '#!/usr/bin/env node',
    },
    plugins: [
      json(),
      typescript({
        exclude: ['**/__tests__', '**/*.test.ts'],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true,
      }),
    ],
    external: EXTERNALS,
  },
]

export default config
