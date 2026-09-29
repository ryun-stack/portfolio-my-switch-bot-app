# Third Party Licenses

This document lists the licenses of third-party (npm) packages used by this repository (`apps/api`, `apps/client`, `packages/shared-types`), generated with `license-checker-rseidelsohn`.

Total packages: 498

## Summary

| License | Count |
|---|---|
| MIT | 430 |
| ISC | 30 |
| BSD-3-Clause | 18 |
| Apache-2.0 | 10 |
| BSD-2-Clause | 5 |
| (MIT OR CC0-1.0) | 2 |
| CC-BY-4.0 | 1 |
| BlueOak-1.0.0 | 1 |
| 0BSD | 1 |

## Notes on uncommon licenses

- **CC-BY-4.0** (`caniuse-lite`): This is browser-compatibility *data*, not executable code
  bundled into the app. It is only consumed at build time by PostCSS/Autoprefixer (via
  Vite/browserslist) to decide which vendor prefixes to emit into the built CSS. It is not
  copied into any distributed artifact (client `dist/`, or the API's runtime container), so
  the CC-BY-4.0 attribution obligation does not apply to what actually ships.
- **BlueOak-1.0.0** (`lru-cache`, a transitive dependency of `jwks-rsa`): A permissive
  license, comparable to or looser than MIT — it only requires attribution when
  redistributing *source* form, not when shipping a compiled/bundled artifact. No copyleft
  obligations.

## MIT

| Package | Version | Repository |
|---|---|---|
| @azure/abort-controller | 2.2.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/core-auth | 1.11.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/core-client | 1.11.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/core-http-compat | 2.5.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/core-paging | 1.7.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/core-rest-pipeline | 1.25.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/core-tracing | 1.4.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/core-util | 1.14.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/core-xml | 1.6.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/data-tables | 13.3.2 | https://github.com/Azure/azure-sdk-for-js |
| @azure/logger | 1.4.0 | https://github.com/Azure/azure-sdk-for-js |
| @azure/msal-browser | 5.18.0 | https://github.com/AzureAD/microsoft-authentication-library-for-js |
| @azure/msal-common | 16.12.0 | https://github.com/AzureAD/microsoft-authentication-library-for-js |
| @azure/storage-common | 12.4.1 | https://github.com/Azure/azure-sdk-for-js |
| @azure/storage-queue | 12.31.0 | https://github.com/Azure/azure-sdk-for-js |
| @babel/code-frame | 7.29.7 | https://github.com/babel/babel |
| @babel/compat-data | 7.29.7 | https://github.com/babel/babel |
| @babel/core | 7.29.7 | https://github.com/babel/babel |
| @babel/generator | 7.29.7 | https://github.com/babel/babel |
| @babel/helper-compilation-targets | 7.29.7 | https://github.com/babel/babel |
| @babel/helper-globals | 7.29.7 | https://github.com/babel/babel |
| @babel/helper-module-imports | 7.29.7 | https://github.com/babel/babel |
| @babel/helper-module-transforms | 7.29.7 | https://github.com/babel/babel |
| @babel/helper-plugin-utils | 7.29.7 | https://github.com/babel/babel |
| @babel/helper-string-parser | 7.29.7 | https://github.com/babel/babel |
| @babel/helper-validator-identifier | 7.29.7 | https://github.com/babel/babel |
| @babel/helper-validator-option | 7.29.7 | https://github.com/babel/babel |
| @babel/helpers | 7.29.7 | https://github.com/babel/babel |
| @babel/parser | 7.29.7 | https://github.com/babel/babel |
| @babel/plugin-syntax-async-generators | 7.8.4 | https://github.com/babel/babel.git#master |
| @babel/plugin-syntax-bigint | 7.8.3 | https://github.com/babel/babel.git#master |
| @babel/plugin-syntax-class-properties | 7.12.13 | https://github.com/babel/babel |
| @babel/plugin-syntax-class-static-block | 7.14.5 | https://github.com/babel/babel |
| @babel/plugin-syntax-import-attributes | 7.29.7 | https://github.com/babel/babel |
| @babel/plugin-syntax-import-meta | 7.10.4 | https://github.com/babel/babel |
| @babel/plugin-syntax-json-strings | 7.8.3 | https://github.com/babel/babel.git#master |
| @babel/plugin-syntax-jsx | 7.29.7 | https://github.com/babel/babel |
| @babel/plugin-syntax-logical-assignment-operators | 7.10.4 | https://github.com/babel/babel |
| @babel/plugin-syntax-nullish-coalescing-operator | 7.8.3 | https://github.com/babel/babel.git#master |
| @babel/plugin-syntax-numeric-separator | 7.10.4 | https://github.com/babel/babel |
| @babel/plugin-syntax-object-rest-spread | 7.8.3 | https://github.com/babel/babel.git#master |
| @babel/plugin-syntax-optional-catch-binding | 7.8.3 | https://github.com/babel/babel.git#master |
| @babel/plugin-syntax-optional-chaining | 7.8.3 | https://github.com/babel/babel.git#master |
| @babel/plugin-syntax-private-property-in-object | 7.14.5 | https://github.com/babel/babel |
| @babel/plugin-syntax-top-level-await | 7.14.5 | https://github.com/babel/babel |
| @babel/plugin-syntax-typescript | 7.29.7 | https://github.com/babel/babel |
| @babel/template | 7.29.7 | https://github.com/babel/babel |
| @babel/traverse | 7.29.7 | https://github.com/babel/babel |
| @babel/types | 7.29.7 | https://github.com/babel/babel |
| @bcoe/v8-coverage | 0.2.3 | https://github.com/demurgos/v8-coverage |
| @borewit/text-codec | 0.2.2 | https://github.com/Borewit/text-codec |
| @cspotcode/source-map-support | 0.8.1 | https://github.com/cspotcode/node-source-map-support |
| @esbuild/win32-x64 | 0.21.5 | https://github.com/evanw/esbuild |
| @istanbuljs/schema | 0.1.6 | https://github.com/istanbuljs/schema |
| @jest/console | 29.7.0 | https://github.com/jestjs/jest |
| @jest/core | 29.7.0 | https://github.com/jestjs/jest |
| @jest/environment | 29.7.0 | https://github.com/jestjs/jest |
| @jest/expect | 29.7.0 | https://github.com/jestjs/jest |
| @jest/expect-utils | 29.7.0 | https://github.com/jestjs/jest |
| @jest/fake-timers | 29.7.0 | https://github.com/jestjs/jest |
| @jest/globals | 29.7.0 | https://github.com/jestjs/jest |
| @jest/reporters | 29.7.0 | https://github.com/jestjs/jest |
| @jest/schemas | 29.6.3 | https://github.com/jestjs/jest |
| @jest/source-map | 29.6.3 | https://github.com/jestjs/jest |
| @jest/test-result | 29.7.0 | https://github.com/jestjs/jest |
| @jest/test-sequencer | 29.7.0 | https://github.com/jestjs/jest |
| @jest/transform | 29.7.0 | https://github.com/jestjs/jest |
| @jest/types | 29.6.3 | https://github.com/jestjs/jest |
| @jridgewell/gen-mapping | 0.3.13 | https://github.com/jridgewell/sourcemaps |
| @jridgewell/remapping | 2.3.5 | https://github.com/jridgewell/sourcemaps |
| @jridgewell/resolve-uri | 3.1.2 | https://github.com/jridgewell/resolve-uri |
| @jridgewell/sourcemap-codec | 1.5.5 | https://github.com/jridgewell/sourcemaps |
| @jridgewell/trace-mapping | 0.3.31 | https://github.com/jridgewell/sourcemaps |
| @jridgewell/trace-mapping | 0.3.9 | https://github.com/jridgewell/trace-mapping |
| @lukeed/csprng | 1.1.0 | https://github.com/lukeed/csprng |
| @nestjs/common | 10.4.22 | https://github.com/nestjs/nest |
| @nestjs/core | 10.4.22 | https://github.com/nestjs/nest |
| @nestjs/platform-express | 10.4.22 | https://github.com/nestjs/nest |
| @nodable/entities | 3.0.0 | https://github.com/nodable/val-parsers |
| @nuxtjs/opencollective | 0.3.2 | https://github.com/nuxt-contrib/opencollective |
| @popperjs/core | 2.11.8 | https://github.com/popperjs/popper-core |
| @rollup/rollup-win32-x64-gnu | 4.62.4 | https://github.com/rollup/rollup |
| @rollup/rollup-win32-x64-msvc | 4.62.4 | https://github.com/rollup/rollup |
| @sinclair/typebox | 0.27.12 | https://github.com/sinclairzx81/sinclair-typebox |
| @tokenizer/inflate | 0.2.7 | https://github.com/Borewit/tokenizer-inflate |
| @tokenizer/token | 0.3.0 | https://github.com/Borewit/tokenizer-token |
| @tsconfig/node10 | 1.0.12 | https://github.com/tsconfig/bases |
| @tsconfig/node12 | 1.0.11 | https://github.com/tsconfig/bases |
| @tsconfig/node14 | 1.0.3 | https://github.com/tsconfig/bases |
| @tsconfig/node16 | 1.0.4 | https://github.com/tsconfig/bases |
| @types/babel__core | 7.20.5 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/babel__generator | 7.27.0 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/babel__template | 7.4.4 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/babel__traverse | 7.28.0 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/body-parser | 1.19.6 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/connect | 3.4.38 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/estree | 1.0.9 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/express | 4.17.25 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/express-serve-static-core | 4.19.9 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/graceful-fs | 4.1.9 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/http-errors | 2.0.5 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/istanbul-lib-coverage | 2.0.6 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/istanbul-lib-report | 3.0.3 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/istanbul-reports | 3.0.4 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/jest | 29.5.14 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/jsonwebtoken | 9.0.10 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/mime | 1.3.5 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/ms | 2.1.0 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/node | 20.19.43 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/qs | 6.15.1 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/range-parser | 1.2.7 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/send | 0.17.6 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/send | 1.2.1 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/serve-static | 1.15.10 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/stack-utils | 2.0.3 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/yargs | 17.0.35 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/yargs-parser | 21.0.3 | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @typespec/ts-http-runtime | 0.3.7 | https://github.com/Azure/azure-sdk-for-js |
| @vitejs/plugin-vue | 5.2.4 | https://github.com/vitejs/vite-plugin-vue |
| @volar/language-core | 2.4.15 | https://github.com/volarjs/volar.js |
| @volar/source-map | 2.4.15 | https://github.com/volarjs/volar.js |
| @volar/typescript | 2.4.15 | https://github.com/volarjs/volar.js |
| @vue/compiler-core | 3.5.40 | https://github.com/vuejs/core |
| @vue/compiler-dom | 3.5.40 | https://github.com/vuejs/core |
| @vue/compiler-sfc | 3.5.40 | https://github.com/vuejs/core |
| @vue/compiler-ssr | 3.5.40 | https://github.com/vuejs/core |
| @vue/compiler-vue2 | 2.7.16 | https://github.com/vuejs/vue |
| @vue/language-core | 2.2.12 | https://github.com/vuejs/language-tools |
| @vue/reactivity | 3.5.40 | https://github.com/vuejs/core |
| @vue/runtime-core | 3.5.40 | https://github.com/vuejs/core |
| @vue/runtime-dom | 3.5.40 | https://github.com/vuejs/core |
| @vue/server-renderer | 3.5.40 | https://github.com/vuejs/core |
| @vue/shared | 3.5.40 | https://github.com/vuejs/core |
| @vue/tsconfig | 0.5.1 | https://github.com/vuejs/tsconfig |
| accepts | 1.3.8 | https://github.com/jshttp/accepts |
| acorn | 8.18.0 | https://github.com/acornjs/acorn |
| acorn-walk | 8.3.5 | https://github.com/acornjs/acorn |
| agent-base | 7.1.4 | https://github.com/TooTallNate/proxy-agents |
| alien-signals | 1.0.13 | https://github.com/johnsoncodehk/signals |
| ansi-escapes | 4.3.2 | https://github.com/sindresorhus/ansi-escapes |
| ansi-regex | 5.0.1 | https://github.com/chalk/ansi-regex |
| ansi-styles | 4.3.0 | https://github.com/chalk/ansi-styles |
| ansi-styles | 5.2.0 | https://github.com/chalk/ansi-styles |
| anynum | 1.0.1 | https://github.com/NaturalIntelligence/anynum |
| append-field | 1.0.0 | https://github.com/LinusU/node-append-field |
| arg | 4.1.3 | https://github.com/zeit/arg |
| argparse | 1.0.10 | https://github.com/nodeca/argparse |
| array-flatten | 1.1.1 | https://github.com/blakeembrey/array-flatten |
| babel-jest | 29.7.0 | https://github.com/jestjs/jest |
| babel-plugin-jest-hoist | 29.6.3 | https://github.com/jestjs/jest |
| babel-preset-current-node-syntax | 1.2.0 | https://github.com/nicolo-ribaudo/babel-preset-current-node-syntax |
| babel-preset-jest | 29.6.3 | https://github.com/jestjs/jest |
| balanced-match | 1.0.2 | https://github.com/juliangruber/balanced-match |
| body-parser | 1.20.4 | https://github.com/expressjs/body-parser |
| bootstrap | 5.3.8 | https://github.com/twbs/bootstrap |
| brace-expansion | 1.1.16 | https://github.com/juliangruber/brace-expansion |
| brace-expansion | 2.1.4 | https://github.com/juliangruber/brace-expansion |
| braces | 3.0.3 | https://github.com/micromatch/braces |
| browserslist | 4.28.7 | https://github.com/browserslist/browserslist |
| bs-logger | 0.2.6 | https://github.com/huafu/bs-logger |
| buffer-from | 1.1.2 | https://github.com/LinusU/buffer-from |
| busboy | 1.6.0 | https://github.com/mscdex/busboy |
| bytes | 3.1.2 | https://github.com/visionmedia/bytes.js |
| call-bind-apply-helpers | 1.0.2 | https://github.com/ljharb/call-bind-apply-helpers |
| call-bound | 1.0.4 | https://github.com/ljharb/call-bound |
| callsites | 3.1.0 | https://github.com/sindresorhus/callsites |
| camelcase | 5.3.1 | https://github.com/sindresorhus/camelcase |
| camelcase | 6.3.0 | https://github.com/sindresorhus/camelcase |
| chalk | 4.1.2 | https://github.com/chalk/chalk |
| char-regex | 1.0.2 | https://github.com/Richienb/char-regex |
| ci-info | 3.9.0 | https://github.com/watson/ci-info |
| cjs-module-lexer | 1.4.3 | https://github.com/nodejs/cjs-module-lexer |
| co | 4.6.0 | https://github.com/tj/co |
| collect-v8-coverage | 1.0.3 | https://github.com/SimenB/collect-v8-coverage |
| color-convert | 2.0.1 | https://github.com/Qix-/color-convert |
| color-name | 1.1.4 | https://github.com/colorjs/color-name |
| concat-map | 0.0.1 | https://github.com/substack/node-concat-map |
| concat-stream | 2.0.0 | https://github.com/maxogden/concat-stream |
| consola | 2.15.3 | https://github.com/nuxt/consola |
| content-disposition | 0.5.4 | https://github.com/jshttp/content-disposition |
| content-type | 1.0.5 | https://github.com/jshttp/content-type |
| convert-source-map | 2.0.0 | https://github.com/thlorenz/convert-source-map |
| cookie | 0.7.2 | https://github.com/jshttp/cookie |
| cookie-signature | 1.0.7 | https://github.com/visionmedia/node-cookie-signature |
| cors | 2.8.5 | https://github.com/expressjs/cors |
| create-jest | 29.7.0 | https://github.com/jestjs/jest |
| create-require | 1.1.1 | https://github.com/nuxt-contrib/create-require |
| cross-spawn | 7.0.6 | https://github.com/moxystudio/node-cross-spawn |
| csstype | 3.2.3 | https://github.com/frenic/csstype |
| de-indent | 1.0.2 | https://github.com/yyx990803/de-indent |
| debug | 2.6.9 | https://github.com/visionmedia/debug |
| debug | 4.4.3 | https://github.com/debug-js/debug |
| dedent | 1.7.2 | https://github.com/dmnd/dedent |
| deepmerge | 4.3.1 | https://github.com/TehShrike/deepmerge |
| depd | 2.0.0 | https://github.com/dougwilson/nodejs-depd |
| destroy | 1.2.0 | https://github.com/stream-utils/destroy |
| detect-newline | 3.1.0 | https://github.com/sindresorhus/detect-newline |
| diff-sequences | 29.6.3 | https://github.com/jestjs/jest |
| dunder-proto | 1.0.1 | https://github.com/es-shims/dunder-proto |
| ee-first | 1.1.1 | https://github.com/jonathanong/ee-first |
| emittery | 0.13.1 | https://github.com/sindresorhus/emittery |
| emoji-regex | 8.0.0 | https://github.com/mathiasbynens/emoji-regex |
| encodeurl | 2.0.0 | https://github.com/pillarjs/encodeurl |
| error-ex | 1.3.4 | https://github.com/qix-/node-error-ex |
| es-define-property | 1.0.1 | https://github.com/ljharb/es-define-property |
| es-errors | 1.3.0 | https://github.com/ljharb/es-errors |
| es-object-atoms | 1.1.2 | https://github.com/ljharb/es-object-atoms |
| esbuild | 0.21.5 | https://github.com/evanw/esbuild |
| escalade | 3.2.0 | https://github.com/lukeed/escalade |
| escape-html | 1.0.3 | https://github.com/component/escape-html |
| escape-string-regexp | 2.0.0 | https://github.com/sindresorhus/escape-string-regexp |
| estree-walker | 2.0.2 | https://github.com/Rich-Harris/estree-walker |
| etag | 1.8.1 | https://github.com/jshttp/etag |
| events | 3.3.0 | https://github.com/Gozala/events |
| execa | 5.1.1 | https://github.com/sindresorhus/execa |
| exit | 0.1.2 | https://github.com/cowboy/node-exit |
| expect | 29.7.0 | https://github.com/jestjs/jest |
| express | 4.22.1 | https://github.com/expressjs/express |
| fast-json-stable-stringify | 2.1.0 | https://github.com/epoberezkin/fast-json-stable-stringify |
| fast-safe-stringify | 2.1.1 | https://github.com/davidmarkclements/fast-safe-stringify |
| fast-xml-builder | 1.3.0 | https://github.com/NaturalIntelligence/fast-xml-builder |
| fast-xml-parser | 5.10.1 | https://github.com/NaturalIntelligence/fast-xml-parser |
| fflate | 0.8.3 | https://github.com/101arrowz/fflate |
| file-type | 20.4.1 | https://github.com/sindresorhus/file-type |
| fill-range | 7.1.1 | https://github.com/jonschlinkert/fill-range |
| finalhandler | 1.3.2 | https://github.com/pillarjs/finalhandler |
| find-up | 4.1.0 | https://github.com/sindresorhus/find-up |
| forwarded | 0.2.0 | https://github.com/jshttp/forwarded |
| fresh | 0.5.2 | https://github.com/jshttp/fresh |
| function-bind | 1.1.2 | https://github.com/Raynos/function-bind |
| gensync | 1.0.0-beta.2 | https://github.com/loganfsmyth/gensync |
| get-intrinsic | 1.3.0 | https://github.com/ljharb/get-intrinsic |
| get-package-type | 0.1.0 | https://github.com/cfware/get-package-type |
| get-proto | 1.0.1 | https://github.com/ljharb/get-proto |
| get-stream | 6.0.1 | https://github.com/sindresorhus/get-stream |
| gopd | 1.2.0 | https://github.com/ljharb/gopd |
| handlebars | 4.7.9 | https://github.com/handlebars-lang/handlebars.js |
| has-flag | 4.0.0 | https://github.com/sindresorhus/has-flag |
| has-symbols | 1.1.0 | https://github.com/inspect-js/has-symbols |
| hasown | 2.0.4 | https://github.com/inspect-js/hasOwn |
| he | 1.2.0 | https://github.com/mathiasbynens/he |
| html-escaper | 2.0.2 | https://github.com/WebReflection/html-escaper |
| http-errors | 2.0.1 | https://github.com/jshttp/http-errors |
| http-proxy-agent | 7.0.2 | https://github.com/TooTallNate/proxy-agents |
| https-proxy-agent | 7.0.6 | https://github.com/TooTallNate/proxy-agents |
| iconv-lite | 0.4.24 | https://github.com/ashtuchkin/iconv-lite |
| import-local | 3.2.0 | https://github.com/sindresorhus/import-local |
| imurmurhash | 0.1.4 | https://github.com/jensyt/imurmurhash-js |
| ipaddr.js | 1.9.1 | https://github.com/whitequark/ipaddr.js |
| is-arrayish | 0.2.1 | https://github.com/qix-/node-is-arrayish |
| is-core-module | 2.16.2 | https://github.com/inspect-js/is-core-module |
| is-fullwidth-code-point | 3.0.0 | https://github.com/sindresorhus/is-fullwidth-code-point |
| is-generator-fn | 2.1.0 | https://github.com/sindresorhus/is-generator-fn |
| is-number | 7.0.0 | https://github.com/jonschlinkert/is-number |
| is-stream | 2.0.1 | https://github.com/sindresorhus/is-stream |
| is-unsafe | 2.0.0 | https://github.com/NaturalIntelligence/is-unsafe |
| jest | 29.7.0 | https://github.com/jestjs/jest |
| jest-changed-files | 29.7.0 | https://github.com/jestjs/jest |
| jest-circus | 29.7.0 | https://github.com/jestjs/jest |
| jest-cli | 29.7.0 | https://github.com/jestjs/jest |
| jest-config | 29.7.0 | https://github.com/jestjs/jest |
| jest-diff | 29.7.0 | https://github.com/jestjs/jest |
| jest-docblock | 29.7.0 | https://github.com/jestjs/jest |
| jest-each | 29.7.0 | https://github.com/jestjs/jest |
| jest-environment-node | 29.7.0 | https://github.com/jestjs/jest |
| jest-get-type | 29.6.3 | https://github.com/jestjs/jest |
| jest-haste-map | 29.7.0 | https://github.com/jestjs/jest |
| jest-leak-detector | 29.7.0 | https://github.com/jestjs/jest |
| jest-matcher-utils | 29.7.0 | https://github.com/jestjs/jest |
| jest-message-util | 29.7.0 | https://github.com/jestjs/jest |
| jest-mock | 29.7.0 | https://github.com/jestjs/jest |
| jest-pnp-resolver | 1.2.3 | https://github.com/arcanis/jest-pnp-resolver |
| jest-regex-util | 29.6.3 | https://github.com/jestjs/jest |
| jest-resolve | 29.7.0 | https://github.com/jestjs/jest |
| jest-resolve-dependencies | 29.7.0 | https://github.com/jestjs/jest |
| jest-runner | 29.7.0 | https://github.com/jestjs/jest |
| jest-runtime | 29.7.0 | https://github.com/jestjs/jest |
| jest-snapshot | 29.7.0 | https://github.com/jestjs/jest |
| jest-util | 29.7.0 | https://github.com/jestjs/jest |
| jest-validate | 29.7.0 | https://github.com/jestjs/jest |
| jest-watcher | 29.7.0 | https://github.com/jestjs/jest |
| jest-worker | 29.7.0 | https://github.com/jestjs/jest |
| jose | 6.2.8 | https://github.com/panva/jose |
| js-tokens | 4.0.0 | https://github.com/lydell/js-tokens |
| js-yaml | 3.15.0 | https://github.com/nodeca/js-yaml |
| jsesc | 3.1.0 | https://github.com/mathiasbynens/jsesc |
| json-parse-even-better-errors | 2.3.1 | https://github.com/npm/json-parse-even-better-errors |
| json5 | 2.2.3 | https://github.com/json5/json5 |
| jsonwebtoken | 9.0.3 | https://github.com/auth0/node-jsonwebtoken |
| jwa | 2.0.1 | https://github.com/brianloveswords/node-jwa |
| jwks-rsa | 4.1.0 | https://github.com/auth0/node-jwks-rsa |
| jws | 4.0.1 | https://github.com/brianloveswords/node-jws |
| kleur | 3.0.3 | https://github.com/lukeed/kleur |
| leven | 3.1.0 | https://github.com/sindresorhus/leven |
| limiter | 1.1.5 | https://github.com/jhurliman/node-rate-limiter |
| lines-and-columns | 1.2.4 | https://github.com/eventualbuddha/lines-and-columns |
| locate-path | 5.0.0 | https://github.com/sindresorhus/locate-path |
| lodash.clonedeep | 4.5.0 | https://github.com/lodash/lodash |
| lodash.includes | 4.3.0 | https://github.com/lodash/lodash |
| lodash.isboolean | 3.0.3 | https://github.com/lodash/lodash |
| lodash.isinteger | 4.0.4 | https://github.com/lodash/lodash |
| lodash.isnumber | 3.0.3 | https://github.com/lodash/lodash |
| lodash.isplainobject | 4.0.6 | https://github.com/lodash/lodash |
| lodash.isstring | 4.0.1 | https://github.com/lodash/lodash |
| lodash.memoize | 4.1.2 | https://github.com/lodash/lodash |
| lodash.once | 4.1.1 | https://github.com/lodash/lodash |
| lru-memoizer | 3.0.0 | https://github.com/jfromaniello/lru-memoizer |
| magic-string | 0.30.21 | https://github.com/Rich-Harris/magic-string |
| make-dir | 4.0.0 | https://github.com/sindresorhus/make-dir |
| math-intrinsics | 1.1.0 | https://github.com/es-shims/math-intrinsics |
| media-typer | 0.3.0 | https://github.com/jshttp/media-typer |
| mediatr-ts | 2.2.0 | https://github.com/m4ss1m0g/mediatr-ts |
| merge-descriptors | 1.0.3 | https://github.com/sindresorhus/merge-descriptors |
| merge-stream | 2.0.0 | https://github.com/grncdr/merge-stream |
| methods | 1.1.2 | https://github.com/jshttp/methods |
| micromatch | 4.0.8 | https://github.com/micromatch/micromatch |
| mime | 1.6.0 | https://github.com/broofa/node-mime |
| mime-db | 1.52.0 | https://github.com/jshttp/mime-db |
| mime-types | 2.1.35 | https://github.com/jshttp/mime-types |
| mimic-fn | 2.1.0 | https://github.com/sindresorhus/mimic-fn |
| minimist | 1.2.8 | https://github.com/minimistjs/minimist |
| mkdirp | 0.5.6 | https://github.com/substack/node-mkdirp |
| ms | 2.0.0 | https://github.com/zeit/ms |
| ms | 2.1.3 | https://github.com/vercel/ms |
| muggle-string | 0.4.1 | https://github.com/johnsoncodehk/muggle-string |
| multer | 2.0.2 | https://github.com/expressjs/multer |
| nanoid | 3.3.16 | https://github.com/ai/nanoid |
| natural-compare | 1.4.0 | https://github.com/litejs/natural-compare-lite |
| negotiator | 0.6.3 | https://github.com/jshttp/negotiator |
| neo-async | 2.6.2 | https://github.com/suguru03/neo-async |
| node-fetch | 2.7.0 | https://github.com/bitinn/node-fetch |
| node-int64 | 0.4.0 | https://github.com/broofa/node-int64 |
| node-releases | 2.0.51 | https://github.com/chicoxyzzy/node-releases |
| normalize-path | 3.0.0 | https://github.com/jonschlinkert/normalize-path |
| npm-run-path | 4.0.1 | https://github.com/sindresorhus/npm-run-path |
| object-assign | 4.1.1 | https://github.com/sindresorhus/object-assign |
| object-inspect | 1.13.4 | https://github.com/inspect-js/object-inspect |
| on-finished | 2.4.1 | https://github.com/jshttp/on-finished |
| onetime | 5.1.2 | https://github.com/sindresorhus/onetime |
| p-limit | 2.3.0 | https://github.com/sindresorhus/p-limit |
| p-limit | 3.1.0 | https://github.com/sindresorhus/p-limit |
| p-locate | 4.1.0 | https://github.com/sindresorhus/p-locate |
| p-try | 2.2.0 | https://github.com/sindresorhus/p-try |
| parse-json | 5.2.0 | https://github.com/sindresorhus/parse-json |
| parseurl | 1.3.3 | https://github.com/pillarjs/parseurl |
| path-browserify | 1.0.1 | https://github.com/browserify/path-browserify |
| path-exists | 4.0.0 | https://github.com/sindresorhus/path-exists |
| path-expression-matcher | 1.6.2 | https://github.com/NaturalIntelligence/path-expression-matcher |
| path-is-absolute | 1.0.1 | https://github.com/sindresorhus/path-is-absolute |
| path-key | 3.1.1 | https://github.com/sindresorhus/path-key |
| path-parse | 1.0.7 | https://github.com/jbgutierrez/path-parse |
| path-to-regexp | 0.1.13 | https://github.com/pillarjs/path-to-regexp |
| path-to-regexp | 3.3.0 | https://github.com/pillarjs/path-to-regexp |
| picomatch | 2.3.2 | https://github.com/micromatch/picomatch |
| pirates | 4.0.7 | https://github.com/danez/pirates |
| pkg-dir | 4.2.0 | https://github.com/sindresorhus/pkg-dir |
| postcss | 8.5.25 | https://github.com/postcss/postcss |
| pretty-format | 29.7.0 | https://github.com/jestjs/jest |
| prompts | 2.4.2 | https://github.com/terkelg/prompts |
| proxy-addr | 2.0.7 | https://github.com/jshttp/proxy-addr |
| pure-rand | 6.1.0 | https://github.com/dubzzz/pure-rand |
| range-parser | 1.2.1 | https://github.com/jshttp/range-parser |
| raw-body | 2.5.3 | https://github.com/stream-utils/raw-body |
| react-is | 18.3.1 | https://github.com/facebook/react |
| readable-stream | 3.6.2 | https://github.com/nodejs/readable-stream |
| require-directory | 2.1.1 | https://github.com/troygoode/node-require-directory |
| resolve | 1.22.12 | https://github.com/browserify/resolve |
| resolve-cwd | 3.0.0 | https://github.com/sindresorhus/resolve-cwd |
| resolve-from | 5.0.0 | https://github.com/sindresorhus/resolve-from |
| resolve.exports | 2.0.3 | https://github.com/lukeed/resolve.exports |
| rollup | 4.62.4 | https://github.com/rollup/rollup |
| safe-buffer | 5.2.1 | https://github.com/feross/safe-buffer |
| safer-buffer | 2.1.2 | https://github.com/ChALkeR/safer-buffer |
| send | 0.19.2 | https://github.com/pillarjs/send |
| serve-static | 1.16.3 | https://github.com/expressjs/serve-static |
| shebang-command | 2.0.0 | https://github.com/kevva/shebang-command |
| shebang-regex | 3.0.0 | https://github.com/sindresorhus/shebang-regex |
| side-channel | 1.1.1 | https://github.com/ljharb/side-channel |
| side-channel-list | 1.0.1 | https://github.com/ljharb/side-channel-list |
| side-channel-map | 1.0.1 | https://github.com/ljharb/side-channel-map |
| side-channel-weakmap | 1.0.2 | https://github.com/ljharb/side-channel-weakmap |
| sisteransi | 1.0.5 | https://github.com/terkelg/sisteransi |
| slash | 3.0.0 | https://github.com/sindresorhus/slash |
| source-map-support | 0.5.13 | https://github.com/evanw/node-source-map-support |
| stack-utils | 2.0.6 | https://github.com/tapjs/stack-utils |
| statuses | 2.0.2 | https://github.com/jshttp/statuses |
| streamsearch | 1.1.0 | https://github.com/mscdex/streamsearch |
| string_decoder | 1.3.0 | https://github.com/nodejs/string_decoder |
| string-length | 4.0.2 | https://github.com/sindresorhus/string-length |
| string-width | 4.2.3 | https://github.com/sindresorhus/string-width |
| strip-ansi | 6.0.1 | https://github.com/chalk/strip-ansi |
| strip-bom | 4.0.0 | https://github.com/sindresorhus/strip-bom |
| strip-final-newline | 2.0.0 | https://github.com/sindresorhus/strip-final-newline |
| strip-json-comments | 3.1.1 | https://github.com/sindresorhus/strip-json-comments |
| strnum | 2.4.1 | https://github.com/NaturalIntelligence/strnum |
| strtok3 | 10.3.5 | https://github.com/Borewit/strtok3 |
| supports-color | 7.2.0 | https://github.com/chalk/supports-color |
| supports-color | 8.1.1 | https://github.com/chalk/supports-color |
| supports-preserve-symlinks-flag | 1.0.0 | https://github.com/inspect-js/node-supports-preserve-symlinks-flag |
| to-regex-range | 5.0.1 | https://github.com/micromatch/to-regex-range |
| toidentifier | 1.0.1 | https://github.com/component/toidentifier |
| token-types | 6.1.2 | https://github.com/Borewit/token-types |
| tr46 | 0.0.3 | https://github.com/Sebmaster/tr46.js |
| ts-jest | 29.4.12 | https://github.com/kulshekhar/ts-jest |
| ts-node | 10.9.2 | https://github.com/TypeStrong/ts-node |
| type-detect | 4.0.8 | https://github.com/chaijs/type-detect |
| type-is | 1.6.18 | https://github.com/jshttp/type-is |
| typedarray | 0.0.6 | https://github.com/substack/typedarray |
| uid | 2.0.2 | https://github.com/lukeed/uid |
| uint8array-extras | 1.5.0 | https://github.com/sindresorhus/uint8array-extras |
| undici-types | 6.21.0 | https://github.com/nodejs/undici |
| unpipe | 1.0.0 | https://github.com/stream-utils/unpipe |
| update-browserslist-db | 1.2.3 | https://github.com/browserslist/update-db |
| util-deprecate | 1.0.2 | https://github.com/TooTallNate/util-deprecate |
| utils-merge | 1.0.1 | https://github.com/jaredhanson/utils-merge |
| v8-compile-cache-lib | 3.0.1 | https://github.com/cspotcode/v8-compile-cache-lib |
| vary | 1.1.2 | https://github.com/jshttp/vary |
| vite | 5.4.21 | https://github.com/vitejs/vite |
| vscode-uri | 3.1.0 | https://github.com/microsoft/vscode-uri |
| vue | 3.5.40 | https://github.com/vuejs/core |
| vue-tsc | 2.2.12 | https://github.com/vuejs/language-tools |
| whatwg-url | 5.0.0 | https://github.com/jsdom/whatwg-url |
| wordwrap | 1.0.0 | https://github.com/substack/node-wordwrap |
| wrap-ansi | 7.0.0 | https://github.com/chalk/wrap-ansi |
| xml-naming | 0.3.0 | https://github.com/NaturalIntelligence/xml-naming |
| xtend | 4.0.2 | https://github.com/Raynos/xtend |
| yargs | 17.7.3 | https://github.com/yargs/yargs |
| yn | 3.1.1 | https://github.com/sindresorhus/yn |
| yocto-queue | 0.1.0 | https://github.com/sindresorhus/yocto-queue |
| zod | 3.25.76 | https://github.com/colinhacks/zod |

## ISC

| Package | Version | Repository |
|---|---|---|
| @istanbuljs/load-nyc-config | 1.1.0 | https://github.com/istanbuljs/load-nyc-config |
| anymatch | 3.1.3 | https://github.com/micromatch/anymatch |
| cliui | 8.0.1 | https://github.com/yargs/cliui |
| electron-to-chromium | 1.5.396 | https://github.com/Kilian/electron-to-chromium |
| fs.realpath | 1.0.0 | https://github.com/isaacs/fs.realpath |
| get-caller-file | 2.0.5 | https://github.com/stefanpenner/get-caller-file |
| glob | 7.2.3 | https://github.com/isaacs/node-glob |
| graceful-fs | 4.2.11 | https://github.com/isaacs/node-graceful-fs |
| inflight | 1.0.6 | https://github.com/npm/inflight |
| inherits | 2.0.4 | https://github.com/isaacs/inherits |
| isexe | 2.0.0 | https://github.com/isaacs/isexe |
| iterare | 1.2.1 | https://github.com/felixfbecker/iterare |
| lru-cache | 5.1.1 | https://github.com/isaacs/node-lru-cache |
| make-error | 1.3.6 | https://github.com/JsCommunity/make-error |
| minimatch | 3.1.5 | https://github.com/isaacs/minimatch |
| minimatch | 9.0.9 | https://github.com/isaacs/minimatch |
| once | 1.4.0 | https://github.com/isaacs/once |
| picocolors | 1.1.1 | https://github.com/alexeyraspopov/picocolors |
| semver | 6.3.1 | https://github.com/npm/node-semver |
| semver | 7.8.5 | https://github.com/npm/node-semver |
| setprototypeof | 1.2.0 | https://github.com/wesleytodd/setprototypeof |
| signal-exit | 3.0.7 | https://github.com/tapjs/signal-exit |
| test-exclude | 6.0.0 | https://github.com/istanbuljs/test-exclude |
| v8-to-istanbul | 9.3.0 | https://github.com/istanbuljs/v8-to-istanbul |
| which | 2.0.2 | https://github.com/isaacs/node-which |
| wrappy | 1.0.2 | https://github.com/npm/wrappy |
| write-file-atomic | 4.0.2 | https://github.com/npm/write-file-atomic |
| y18n | 5.0.8 | https://github.com/yargs/y18n |
| yallist | 3.1.1 | https://github.com/isaacs/yallist |
| yargs-parser | 21.1.1 | https://github.com/yargs/yargs-parser |

## BSD-3-Clause

| Package | Version | Repository |
|---|---|---|
| @sinonjs/commons | 3.0.1 | https://github.com/sinonjs/commons |
| @sinonjs/fake-timers | 10.3.0 | https://github.com/sinonjs/fake-timers |
| babel-plugin-istanbul | 6.1.1 | https://github.com/istanbuljs/babel-plugin-istanbul |
| buffer-equal-constant-time | 1.0.1 | https://github.com/goinstant/buffer-equal-constant-time |
| diff | 4.0.4 | https://github.com/kpdecker/jsdiff |
| ieee754 | 1.2.1 | https://github.com/feross/ieee754 |
| istanbul-lib-coverage | 3.2.2 | https://github.com/istanbuljs/istanbuljs |
| istanbul-lib-instrument | 5.2.1 | https://github.com/istanbuljs/istanbuljs |
| istanbul-lib-instrument | 6.0.3 | https://github.com/istanbuljs/istanbuljs |
| istanbul-lib-report | 3.0.1 | https://github.com/istanbuljs/istanbuljs |
| istanbul-lib-source-maps | 4.0.1 | https://github.com/istanbuljs/istanbuljs |
| istanbul-reports | 3.2.0 | https://github.com/istanbuljs/istanbuljs |
| makeerror | 1.0.12 | https://github.com/daaku/nodejs-makeerror |
| qs | 6.14.2 | https://github.com/ljharb/qs |
| source-map | 0.6.1 | https://github.com/mozilla/source-map |
| source-map-js | 1.2.1 | https://github.com/7rulnik/source-map-js |
| sprintf-js | 1.0.3 | https://github.com/alexei/sprintf.js |
| tmpl | 1.0.5 | https://github.com/daaku/nodejs-tmpl |

## Apache-2.0

| Package | Version | Repository |
|---|---|---|
| baseline-browser-mapping | 2.11.1 | https://github.com/web-platform-dx/baseline-browser-mapping |
| bser | 2.1.1 | https://github.com/facebook/watchman |
| ecdsa-sig-formatter | 1.0.11 | https://github.com/Brightspace/node-ecdsa-sig-formatter |
| fb-watchman | 2.0.2 | https://github.com/facebook/watchman |
| human-signals | 2.1.0 | https://github.com/ehmicky/human-signals |
| reflect-metadata | 0.2.2 | https://github.com/rbuckton/reflect-metadata |
| rxjs | 7.8.2 | https://github.com/reactivex/rxjs |
| typescript | 5.9.3 | https://github.com/microsoft/TypeScript |
| typescript | 6.0.3 | https://github.com/microsoft/TypeScript |
| walker | 1.0.8 | https://github.com/daaku/nodejs-walker |

## BSD-2-Clause

| Package | Version | Repository |
|---|---|---|
| dotenv | 16.4.7 | https://github.com/motdotla/dotenv |
| entities | 7.0.1 | https://github.com/fb55/entities |
| esprima | 4.0.1 | https://github.com/jquery/esprima |
| uglify-js | 3.19.3 | https://github.com/mishoo/UglifyJS |
| webidl-conversions | 3.0.1 | https://github.com/jsdom/webidl-conversions |

## (MIT OR CC0-1.0)

| Package | Version | Repository |
|---|---|---|
| type-fest | 0.21.3 | https://github.com/sindresorhus/type-fest |
| type-fest | 4.41.0 | https://github.com/sindresorhus/type-fest |

## CC-BY-4.0

| Package | Version | Repository |
|---|---|---|
| caniuse-lite | 1.0.30001806 | https://github.com/browserslist/caniuse-lite |

## BlueOak-1.0.0

| Package | Version | Repository |
|---|---|---|
| lru-cache | 11.5.2 | https://github.com/isaacs/node-lru-cache |

## 0BSD

| Package | Version | Repository |
|---|---|---|
| tslib | 2.8.1 | https://github.com/Microsoft/tslib |

