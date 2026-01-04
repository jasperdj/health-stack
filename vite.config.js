import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: replace 'health-stack-optimizer' with your repo name
  // If deploying to https://<username>.github.io/<repo-name>/
  // base: '/<repo-name>/',
  // If deploying to https://<username>.github.io/ (user/org site), use:
  // base: '/',
  base: '/health-stack-optimizer/',
})
