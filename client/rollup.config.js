import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import injectProcessEnv from "rollup-plugin-inject-process-env";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "es",
      manualChunks: {
        three: ["three"],
      },
      sourcemap: true,
      sourcemapExcludeSources: true,
      plugins: [terser()],
    },
  ],
  watch: {
    buildDelay: 0,
    clearScreen: false,
  },
  plugins: [
    typescript({
      noEmitOnError: false,
      include: ["src/**/*.ts", "src/config.json"],
    }),
    injectProcessEnv({
      DEBUG: process.env.DEBUG,
    }),
    nodeResolve(),
  ],
};
