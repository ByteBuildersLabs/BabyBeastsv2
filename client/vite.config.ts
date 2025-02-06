import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";
//import fs from "fs";

export default defineConfig({
  // Windows
  // server: {
  //   https: {
  //     key: fs.readFileSync("localhost-key.pem"), // Path to private key file
  //     cert: fs.readFileSync("localhost.pem"), // Path to certificate file
  //   },
  // },

  // MAC
  // server: {
  //   https: {
  //     key: fs.readFileSync("mkcert+1-key.pem"), // Path to private key file
  //     cert: fs.readFileSync("mkcert+1.pem"),   // Path to certificate file
  //   },
  // },
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["https://github.com/ByteBuildersLabs/BabyBeastsv2/blob/master/client/src/assets/img/logo.svg"],
      manifest: {
        name: "BabyBeasts",
        short_name: "BabyBeasts",
        description: "Take care of your baby beasts",
        theme_color: "#000",
        background_color: "#000",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "https://github.com/ByteBuildersLabs/BabyBeastsv2/blob/master/client/src/assets/img/logo.svg",
            sizes: "180x180",
            type: "image/svg",
          },
        ],
        start_url: "/",
        id: "BabyBeasts",
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Set to 5 MiB
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot,jpeg,jpg}",
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
          {
            urlPattern: /\.(?:mp3|wav|ogg)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "audio-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /.*/, // Fallback for everything else
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "fallback-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
});
