// Vite settings: only the Vue plugin, so .vue files work.
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({ plugins: [vue()] })
