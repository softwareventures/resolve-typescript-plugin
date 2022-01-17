import {fork} from "child_process";
import {resolve} from "path";
import test from "ava";

async function buildTestProject(path: string): Promise<void> {
    return yarn(path, [])
        .then(code => (code === 0 ? yarn(path, ["build"]) : code))
        .then(code => {
            if (code !== 0) {
                throw new Error("Build exited with error status");
            }
        });
}

async function yarn(path: string, args: readonly string[]): Promise<number> {
    const fullPath = resolve(__dirname, path);
    return new Promise((resolve, reject) =>
        fork(require.resolve("yarn/bin/yarn.js"), args, {cwd: fullPath})
            .on("error", reject)
            .on("exit", (code, signal) => (code == null ? reject(signal) : resolve(code)))
    );
}

test("type-module-config-cjs-import-js", async t => {
    await buildTestProject("test-projects/type-module-config-cjs-import-js");
    t.pass();
});

test("backward-compatibility-pre-1.1.2-config-cjs", async t => {
    await buildTestProject("test-projects/backward-compatibility-pre-1.1.2-config-cjs");
    t.pass();
});
