import {ResolveOptions} from "webpack";

type Resolver = NonNullable<ResolveOptions["resolver"]>;

const pluginName = "ResolveTypescriptPlugin";

export default class ResolveTypescriptPlugin {
    public apply(resolver: Resolver): void {
        const target = resolver.ensureHook("file");
        resolver.getHook("raw-file").tapAsync(pluginName, (request, resolveContext, callback) => {
            if (!request.path || request.path.split(/[\\/]/).indexOf("node_modules") >= 0) {
                return callback();
            }

            const path = request.path.replace(/\.js$/, ".ts");
            if (path === request.path) {
                callback();
            } else {
                resolver.doResolve(
                    target,
                    {
                        ...request,
                        path,
                        relativePath:
                            request.relativePath && request.relativePath.replace(/\.js$/, ".ts")
                    },
                    `using path: ${path}`,
                    resolveContext,
                    callback
                );
            }
        });
    }
}
