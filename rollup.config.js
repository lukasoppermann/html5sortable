import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import strip from 'rollup-plugin-strip-code'
import pkg from './package.json'

let dir = `${pkg.dest}/`
let banner = `/*
 * HTML5Sortable package
 * https://github.com/lukasoppermann/html5sortable
 *
 * Maintained by Lukas Oppermann <lukas@vea.re>
 *
 * Released under the MIT license.
 */`
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
} else {
  dir = '_test/'
}

export default [
  {
    input: pkg.file,
    output: {
      name: 'sortable',
      file: `${dir}${pkg.name}.min.js`,
      format: 'iife',
      sourcemap: true,
      banner: banner
    },
    plugins: [...plugins, uglify()]
  },
  {
    input: pkg.file,
    output: [
      { file: `${dir}${pkg.name}.js`, format: 'iife', name: 'sortable', banner: banner },
      { file: `${dir}${pkg.name}.cjs.js`, format: 'cjs', banner: banner },
      { file: `${dir}${pkg.name}.amd.js`, format: 'amd', banner: banner },
      { file: `${dir}${pkg.name}.es.js`, format: 'es', banner: banner }
    ],
    plugins: plugins
  }
]
