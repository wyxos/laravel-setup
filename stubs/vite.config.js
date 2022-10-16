import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import mkcert from 'vite-plugin-mkcert'
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  server: {
    https: true,
    hmr: {
      host: '127.0.0.1'
    },
    host: '127.0.0.1'
  },
  plugins: [
    mkcert(),
    vue({
      template: {
        transformAssetUrls: {
          // The Vue plugin will re-write asset URLs, when referenced
          // in Single File Components, to point to the Laravel web
          // server. Setting this to `null` allows the Laravel plugin
          // to instead re-write asset URLs to point to the Vite
          // server instead.
          base: null,

          // The Vue plugin will parse absolute URLs and treat them
          // as absolute paths to files on disk. Setting this to
          // `false` will leave absolute URLs un-touched so they can
          // reference assets in the public directly as expected.
          includeAbsolute: false,
        },
      },
    }),
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.js',
        'resources/app/js/main.js',
        'resources/admin/js/main.js'
      ],
      refresh: true,
    }),
  ],
});
