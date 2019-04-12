module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "mocha": true,
        "amd": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 2017
    },
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": [
            "warn",
        ],
        "no-console": [
            "warn",
        ]
    }
};
