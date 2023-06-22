import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import webExtension from "vite-plugin-web-extension"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), webExtension()],
})
