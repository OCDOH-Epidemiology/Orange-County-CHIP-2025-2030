import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: For GitHub Pages, `base` must be `/REPO_NAME/` where REPO_NAME is
// the exact name of your GitHub repository. For example, if your repo lives at
//   https://github.com/orangecountyny/chip-dashboard
// then `base` must be `/chip-dashboard/`.
//
// Replace `REPO_NAME` below before you deploy. If you skip this step, the
// deployed site will render blank because CSS and JS asset URLs will 404.
//
// (For local development, this base is applied automatically — you'll visit
//  http://localhost:5173/REPO_NAME/ when running `npm run dev`.)
export default defineConfig({
  base: '/Orange-County-CHIP-2025-2030/',
  plugins: [react()],
});
