"use strict";

const ResolveTypeScriptPlugin = require("../..");

module.exports = {
    mode: "production",
    context: __dirname,
    entry: "./index.js",
    module: {
        rules: [
            {
                test: /\.tsx?$/u,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        plugins: [new ResolveTypeScriptPlugin()]
    }
};
