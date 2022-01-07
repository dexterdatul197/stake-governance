module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    'no-use-before-define': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/display-name': ['off'],
    'react-hooks/exhaustive-deps': 'off',
    'import/no-extraneous-dependencies': ['off'],
    '@typescript-eslint/no-empty-function': ['off', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-unused-vars': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    'react/jsx-filename-extension': [
      'off',
      {
        extensions: ['.tsx']
      }
    ],
    'no-console': 'off',
    'no-shadow': 'off',
    'max-len': [
      'off',
      {
        code: 120
      }
    ],
    'prettier/prettier': [
      'off',
      {
        endOfLine: 'auto'
      }
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-var-requires': 0,
    'eslint no-extra-boolean-cast': 'off',
    '@typescript-eslint/ban-types': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
  overrides: [
    {
      files: '*.{css, scss}'
    }
  ],
  settings: {
    'import/resolver': {
      typescript: {}
    },
    react: {
      version: 'detect'
    }
  }
};
