import type {ResolveOptions} from "webpack";

type Resolver = NonNullable<ResolveOptions["resolver"]>;

const pluginName = "ResolveTypescriptPlugin";

interface ResolveTypescriptPluginOptions {
    includeNodeModules?: boolean;
}

class ResolveTypescriptPlugin {
    /** @deprecated For backwards compatibility with versions < v1.1.2.
     * Will be removed in v2.0. */
    public static default = ResolveTypescriptPlugin;

    private static readonly defaultOptions: ResolveTypescriptPluginOptions = {
        includeNodeModules: false
    };

    private readonly options: ResolveTypescriptPluginOptions;

    public constructor(options: ResolveTypescriptPluginOptions = {}) {
        this.options = {...ResolveTypescriptPlugin.defaultOptions, ...options};
    }

    public apply(resolver: Resolver): void {
        const target = resolver.ensureHook("file");
        for (const extension of [".ts", ".tsx"]) {
            resolver
                .getHook("raw-file")
                .tapAsync(pluginName, (request, resolveContext, callback) => {
                    if (
                        typeof request.path !== "string" ||
                        (!(this.options.includeNodeModules ?? false) &&
                            request.path.match(/(^|[\\/])node_modules($|[\\/])/u) != null)
                    ) {
                        callback();
                        return;
                    }

                    const path = request.path.replace(/\.jsx?$/u, extension);
                    if (path === request.path) {
                        callback();
                    } else {
                        resolver.doResolve(
                            target,
                            {
                                ...request,
                                path,
                                relativePath: request.relativePath?.replace(/\.jsx?$/u, extension)
                            },
                            `using path: ${path}`,
                            resolveContext,
                            callback
                        );
                    }
                });
        }
    }
}

export = ResolveTypescriptPlugin;
