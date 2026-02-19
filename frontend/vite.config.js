import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import vitePluginSvgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vitePluginSvgr()],

  // Matches .js and .jsx files in the src folder
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', //backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },

})
