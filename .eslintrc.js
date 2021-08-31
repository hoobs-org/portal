module.exports = {
    root: true,
    env: { node: true },
    extends: ["plugin:vue/vue3-essential", "@vue/airbnb"],
    parserOptions: { parser: "babel-eslint" },
    rules: {
        "comma-dangle": ["error", "always-multiline"],
        "import/no-extraneous-dependencies": "off",
        indent: ["error", 4, { SwitchCase: 1 }],
        "max-len": ["error", { code: 220 }],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-plusplus": "off",
        quotes: ["error", "double"],
        "spaced-comment": "off",
        "vue/html-indent": ["error", 4, { attribute: 1, baseIndent: 1 }],
        "vue/script-indent": ["error", 4, { baseIndent: 1, switchCase: 1 }],
    },
    overrides: [{
        files: ["*.vue"],
        rules: {
            indent: "off",
            "max-len": "off",
            "quote-props": "off",
        },
    }, {
        files: ["server/*.js"],
        rules: {
            "class-methods-use-this": "off",
            "global-require": "off",
            "import/extensions": "off",
        },
    }, {
        files: ["scripts/*"],
        rules: {
            "global-require": "off",
            "import/extensions": "off",
            "import/no-dynamic-require": "off",
            "import/no-unresolved": "off",
        },
    }],
};
