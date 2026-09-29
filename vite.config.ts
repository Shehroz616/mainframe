import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const totalFrames = readdirSync(resolve(__dirname, 'public/frames'))
  .filter((f) => /^ezgif-frame-\d{3}\.webp$/.test(f)).length

export default defineConfig({
  plugins: [react()],
  define: { __TOTAL_FRAMES__: totalFrames },
})