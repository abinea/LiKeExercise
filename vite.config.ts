import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "node:path"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"

const resolve = (dir) => path.resolve(__dirname, dir)

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入框架、路由库、状态管理库的API
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: ["vue", "vue-router", "pinia"],
      dirs: ["src/utils"],
      dts: "src/auto-imports.d.ts",
    }),
    // 自动导入使用组件
    Components({
      // antdv 按需导入
      resolvers: [
        AntDesignVueResolver({
          importStyle: true,
          resolveIcons: true,
        }),
      ],
      // 自定义组件 自动导入
      dirs: "src/components",
      extensions: ["vue"],
      dts: "src/components.d.ts",
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${resolve("src/styles/variable.less")}";`,
        },
        additionalData: `
        @import "${resolve("src/styles/global.less")}";
        @import "${resolve("src/styles/animation.less")}";
        @import "${resolve("src/styles/transtion.less")}";
        @import "${resolve("src/styles/antdv.less")}";
        `,
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
})
