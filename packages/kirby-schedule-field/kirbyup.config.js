import { defineConfig } from 'kirbyup/config'
import vue2 from '@vitejs/plugin-vue2'

export default defineConfig({
  alias: {
    // Custom aliases
  },
  vite: {
    plugins: [
        vue2()
    ],
    test:{
        environment: 'jsdom',
        globals: true,
    }
  },
})