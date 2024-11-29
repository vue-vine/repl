import type { LanguageRegistration } from 'shiki/core'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor-core'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs'

import langCss from 'shiki/langs/css.mjs'
import langTs from 'shiki/langs/typescript.mjs'
import themeDark from 'shiki/themes/vitesse-dark.mjs'

import vineInject from './syntaxes/vine-inject.json'
import vineVueTemplate from './syntaxes/vine-vue-template.json'
import vueDirectives from './syntaxes/vue-directives.json'
import vueInterpolations from './syntaxes/vue-interpolations.json'

const langVine = [
  {
    ...vineVueTemplate,
    embeddedLangs: [
      'typescript',
    ],
  } as LanguageRegistration,
  {
    ...vueInterpolations,
    name: 'vine-vue-interpolations',
    injectTo: [
      'source.vine-vue-template',
    ],
  } as LanguageRegistration,
  {
    ...vueDirectives,
    name: 'vine-vue-directives',
    injectTo: [
      'source.vine-vue-template',
    ],
  } as LanguageRegistration,
  {
    ...vineInject,
    name: 'vine-ts',
    embeddedLangs: [
      'typescript',
      'vine-vue-template',
      'css',
    ],
    embeddedLangsLazy: [
      'scss',
      'sass',
      'less',
      'postcss',
      'stylus',
    ],
    injectTo: [
      'source.ts',
    ],
  } as any as LanguageRegistration,
]

let registered = false
export function registerHighlighter() {
  if (!registered) {
    const highlighter = createHighlighterCoreSync({
      themes: [themeDark],
      langs: [
        langTs,
        langCss,
        ...langVine,
      ],
      engine: createJavaScriptRegexEngine(),
    })
    monaco.languages.register({ id: 'vue' })
    shikiToMonaco(highlighter, monaco)
    registered = true
  }

  return {
    theme: themeDark.name!,
  }
}
