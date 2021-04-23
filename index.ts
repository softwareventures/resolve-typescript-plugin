import {ResolveOptions} from "webpack";

type Resolver = NonNullable<ResolveOptions["resolver"]>;

const pluginName = "ResolveTypescriptPlugin";

export default class ResolveTypescriptPlugin {
    public apply(resolver: Resolver): void {
        const target = resolver.ensureHook("file");
        resolver.getHook("raw-file").tapAsync(pluginName, (request, resolveContext, callback) => {
            if (!request.path || request.path.match(/(^|[\\/])node_modules($|[\\/])/)) {
                return callback();
            }

            const path = request.path.replace(/\.js$/, "");
            if (path === request.path) {
                callback();
            } else {
                for (const extension of [".ts", ".tsx"]) {
                    resolver.doResolve(
                        target,
                        {
                            ...request,
                            path: `${path}${extension}`,
                            relativePath:
                                request.relativePath &&
                                request.relativePath.replace(/\.js$/, extension)
                        },
                        `using path: ${path}`,
                        resolveContext,
                        callback
                    );
                }
            }
        });
    }
}
