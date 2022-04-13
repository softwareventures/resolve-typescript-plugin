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
import ResolveTypeScriptPlugin from "resolve-typescript-plugin";

export default {
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
};
```

You will also need to have [ts-loader][4] (or another TypeScript loader)
installed and configured.

Previous versions of this README recommended setting `resolve.fullySpecified` to
`true`. This is no longer recommended because it breaks compatibility with
webpack-dev-server and possibly other webpack tooling.

If you use this plugin, you should probably remove `.ts` and `.tsx` from
`resolve.extensions`.

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

## Webpack 4 Compatibility

This plugin supports webpack versions 4.x and 5.x. However, there are some
caveats when using webpack 4.x in conjunction with ES modules.

Webpack 4.x does not support `webpack.config` files in ES module format, so if
you set `"type": "module"` in `package.json` then you must mark the
`webpack.config` file as a CommonJS file by naming it `webpack.config.cjs`
(with a `.cjs` extension). Of course, you must also use CommonJS format, for
example:

```js
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

module.exports = {
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
};
```

Webpack 4.x also will not discover the `webpack.config` file automatically if
it is named with a `.cjs` extension, so you must specify the path to the
configuration file explicitly when running webpack, for example:
`webpack --config ./webpack.config.cjs`.

Webpack 5.x has none of these caveats. In Webpack 5.x, configuration files may
be in ES Module or CommonJS format, and will be discovered automatically if
they are named with any of `.js`, `.cjs`, or `.mjs` file extensions.

## Feedback

We're seeking [community feedback][5] on this plugin.

Please report bugs, problems, and missing features on the [GitHub Issue
Tracker][6].

[1]: https://github.com/microsoft/TypeScript/issues/16577#issuecomment-703190339
[2]: https://webpack.js.org/configuration/resolve/#resolveextensions
[3]: https://github.com/TypeStrong/ts-loader/issues/1110
[4]: https://www.npmjs.com/package/ts-loader
[5]: https://github.com/softwareventures/resolve-typescript-plugin/issues/5
[6]: https://github.com/softwareventures/resolve-typescript-plugin/issues
