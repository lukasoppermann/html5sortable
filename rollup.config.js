import uglify from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import strip from 'rollup-plugin-strip-code'
import pkg from './package.json'

let dir = (process.env.test ? '_test/' : 'dist/')
let plugins = [
  typescript({
    target: 'ES5'
  })
]
// strip test code if not in testing mode
if (!process.env.test) {
  plugins = [...plugins, strip({
    start_comment: 'START.TESTS_ONLY',
    end_comment: 'END.TESTS_ONLY'
  })]
}

export default [
  {
    input: 'src/html.sortable.ts',
    output: {
      name: 'sortable',
      file: `${dir}${pkg.file}.min.js`,
      format: 'iife',
      sourcemap: true
    },
    plugins: [...plugins, uglify()]
  },
  {
    input: 'src/html.sortable.ts',
    output: [
      { file: `${dir}${pkg.file}.js`, format: 'iife', name: 'sortable' },
      { file: `${dir}${pkg.file}.cjs.js`, format: 'cjs' },
      { file: `${dir}${pkg.file}.amd.js`, format: 'amd' },
      { file: `${dir}${pkg.file}.es.js`, format: 'es' }
    ],
    plugins: plugins
  }
]
