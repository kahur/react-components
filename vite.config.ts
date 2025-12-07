import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from 'vite-plugin-dts';
import {libInjectCss} from "vite-plugin-lib-inject-css";

export default defineConfig(({ command, mode }) => {
    if (mode == "demo") {
        return {
            root: path.resolve(__dirname, "example"),
            plugins: [react()],

            build: {
                outDir: path.resolve(__dirname, "dist-example"),
                rollupOptions: {
                    input: path.resolve(__dirname, "example/index.html"),
                },
            },
            resolve: {
                alias: {
                    "@kh-react-components": path.resolve(__dirname, "src/components"),
                }
            }
        }
    }

    // main prod config
    return {
        plugins: [
            react(),
            libInjectCss(),
            dts({include: ['src'], outDir: 'dist'})
        ],
        resolve: {
            alias: {
                "@kh-react-components": path.resolve(__dirname, "src/components"),
            }
        },
        build: {
            lib: {
                entry: path.resolve(__dirname, "src/index.ts"),
                name: "kh-react-components",
                fileName: (format) => format === 'es' ? "index.esm.js" : "index.cjs.js",
            },
            rollupOptions: {
                external: ["react", "react-dom"],
                output: {
                    globals: {
                        react: "React",
                        "react-dom": "ReactDOM"
                    }
                }
            }
        }
    }
});