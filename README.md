# resolve-typescript-plugin

A webpack plugin to resolve TypeScript files imported using the `.js` extension
when using ESM imports.

## Why?

If you are using webpack in conjunction with TypeScript and ES Modules, you need
this plugin for full compliance with the ES Modules ecosystem.

ES Modules require imports to specify the runtime path of the file to be
imported, including file extension. For TypeScript files, this means that [you
must import using the extension `.js`][1] even though the source file uses the
extension `.ts` or `.tsx`. This is because TypeScript compiles to a `.js` file
that will be used at runtime.

However, webpack behaves differently, even when configured for ES Modules.
webpack expects that files will be imported by specifying the compile-time path
of the file, including the compile-time extension. For TypeScript files this
will be `.ts` or `.tsx`. Alternatively, webpack expects that files will be
imported with no extension, in which case webpack will resolve the extension
automatically according to the [`resolve.extensions` option][2]. Neither of
these behaviours is consistent with browser or node ES Module environments.

This plugin extends webpack module resolution so that imports specifying a `.js`
extension will resolve to the corresponding `.ts` or `.tsx` file if available,
and fall back to `.js` otherwise.

If you want to create ES Modules in TypeScript that are consistent between
webpack, browser, and node environments, use this plugin.

See [ts-loader#1110][3] for more background on this issue.

## Install

With npm:

```bash
npm install --save-dev resolve-typescript-plugin
```

or yarn:

```bash
yarn add --dev resolve-typescript-plugin
```

## Usage

Include the following in `package.json` to configure your project to be an ES
Module:

```json
{
    "type": "module"
}
```

Include something like the following in `webpack.config.js`:

```js
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        fullySpecified: true,
        plugins: [new ResolveTypeScriptPlugin()]
    }
};
```

You will also need to have [ts-loader][4] (or another TypeScript loader)
installed and configured.

The `resolve.fullySpecified` option configures webpack to require file
extensions except when importing external modules by name. This is consistent
with node's implementation of ES Modules.

If you set `resolve.fullySpecified` you should also delete the
`resolve.extensions` option, if any.

## Options

Pass options to the plugin as an argument to the constructor, as follows:

```js
new ResolveTypeScriptPlugin({
    includeNodeModules: false
});
```

### includeNodeModules

By default, the plugin does not resolve TypeScript files inside `node_modules`
subdirectories. To enable this, set `includeNodeModules: true`.

Default: `false`.

## Feedback

We're seeking [community feedback][5] on this plugin.

Please report bugs, problems, and missing features on the [GitHub Issue
Tracker][6].

[1]: https://github.com/microsoft/TypeScript/issues/16577#issuecomment-703190339
[2]: https://github.com/TypeStrong/ts-loader/issues/1110
[3]: https://webpack.js.org/configuration/resolve/#resolveextensions
[4]: https://www.npmjs.com/package/ts-loader
[5]: https://github.com/softwareventures/resolve-typescript-plugin/issues/5
[6]: https://github.com/softwareventures/resolve-typescript-plugin/issues
