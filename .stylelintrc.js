const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.stylelint,
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'page'],
      },
    ],
    "selector-type-no-unknown": [true, {
      "ignore": ["custom-elements", "default-namespace"]
    }],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
  },
};
