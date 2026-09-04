import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const totalFrames = readdirSync(resolve(__dirname, 'public/frames'))
  .filter((fileName) => /^frame_\d{4}\.jpg$/.test(fileName)).length

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __TOTAL_FRAMES__: JSON.stringify(totalFrames),
  },
})
