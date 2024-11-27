// @ts-check

import antfu from '@antfu/eslint-config'
import VueVine from '@vue-vine/eslint-config'

export default antfu(
  { /* Override Antfu's default settings */ },
  {
    rules: {
      'no-console': 'off',
    },
  },
  ...VueVine(), // Load VueVine's ESLint config
)
