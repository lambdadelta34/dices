import {terser} from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "es",
      manualChunks: {
        three: ["three"]
      },
      sourcemap: true,
      sourcemapExcludeSources: true,
      plugins: [terser()]
    }
  ],
  watch: {
    buildDelay: 0,
    clearScreen: false
  },
  plugins: [nodeResolve(), typescript({noEmitOnError: false})]
};
