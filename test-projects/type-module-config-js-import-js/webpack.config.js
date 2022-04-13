import {fileURLToPath} from "url";
import {dirname} from "path";
import ResolveTypeScriptPlugin from "resolve-typescript-plugin";

export default {
    mode: "production",
    context: dirname(fileURLToPath(import.meta.url)),
    entry: "./index.js",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        plugins: [new ResolveTypeScriptPlugin()]
    }
}
