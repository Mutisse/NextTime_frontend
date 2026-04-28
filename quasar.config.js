/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require("quasar/wrappers");

module.exports = configure(function (/* ctx */) {
  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ["version-check", "pusher"],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      "roboto-font",
      "material-icons",
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },

      // IMPORTANTE: Para Vercel, usar 'hash' é mais seguro
      vueRouterMode: "hash", // available values: 'hash', 'history'

      // IMPORTANTE: Diretório de saída para o build
      distDir: "dist/spa",

      // Public path para assets
      publicPath: "/",

      // Otimizações para produção
      minify: true,

      // Compressão
      sourceMap: false,

      // Otimizações adicionais
      htmlMinify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },

      // Env vars para produção
      env: {
        API_URL: process.env.API_URL || "https://api.seudominio.com",
        NODE_ENV: "production"
      },

      // Vite plugins
      vitePlugins: [
        [
          "vite-plugin-checker",
          {
            eslint: {
              lintCommand: 'eslint "./**/*.{js,mjs,cjs,vue}"',
            },
          },
          { server: false },
        ],
        ['vite-plugin-wasm', {}],
      ],
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      open: true,
      port: 9000,
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        light: true,
        brand: {
          primary: "#6366f1",
          secondary: "#4f46e5",
          accent: "#8b5cf6",
          dark: "#1e293b",
          positive: "#10b981",
          negative: "#ef4444",
          info: "#3b82f6",
          warning: "#f59e0b"
        },
        notify: {
          position: "top-right",
          timeout: 3000,
          actions: [{ icon: "close", color: "white" }]
        },
        loading: {
          color: "primary",
          delay: 400
        }
      },

      iconSet: "material-icons",
      lang: "pt-BR",

      // Quasar plugins
      plugins: ["Notify", "Loading", "Dialog", "BottomSheet", "AppVisibility"],
    },

    // Animações
    animations: "all",

    // Configurações SSR (se não usar, mantém como está)
    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },

    // PWA
    pwa: {
      workboxMode: "generateSW",
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
      manifest: {
        name: "KLC Market",
        short_name: "KLC",
        description: "Plataforma de eventos e serviços",
        display: "standalone",
        start_url: "/",
        theme_color: "#6366f1",
        background_color: "#ffffff",
        icons: []
      }
    },

    // Cordova (se não usar, mantém)
    cordova: {},

    // Capacitor (se não usar, mantém)
    capacitor: {
      hideSplashscreen: true,
    },

    // Electron (se não usar, mantém)
    electron: {
      inspectPort: 5858,
      bundler: "packager",
      packager: {},
      builder: {
        appId: "klc-market",
      },
    },

    // Browser Extension (se não usar, mantém)
    bex: {
      contentScripts: ["my-content-script"],
    },
  };
});
