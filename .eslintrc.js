module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "airbnb-base",
    ],
    parserOptions: {
        ecmaVersion: 13,
        sourceType: "module",
    },
    rules: {
        "no-console": "off",
        "no-unused-vars": "warn",
        "quotes": ["error", "double"],
        "func-names": "off",
        "object-shorthand": "off",
        "strict": 0,
        "quote-props": 0,
        "indent": ["error", 4],
        "no-tabs": 0,
        "eol-last": "warn",
        "no-multiple-empty-lines": "warn",
        "no-plusplus": 0,
        "no-restricted-syntax": 0,
        "arrow-parens": 0,
        "max-len": 0,
        "no-alert": 0,
    },
};
