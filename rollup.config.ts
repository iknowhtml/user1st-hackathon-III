import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const plugins = [nodeResolve(), typescript({ tsconfig: './tsconfig.json' })];

const defaultOutput = {
  format: 'cjs',
  sourcemap: true,
};

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/script.js',
        ...defaultOutput,
      },
    ],
    plugins,
  },
  {
    input: 'src/diff-dom/index.ts',
    output: [
      {
        file: 'dist/diff-dom.js',
        ...defaultOutput,
      },
    ],
    plugins,
  },
];
