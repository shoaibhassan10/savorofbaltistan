import { resolve } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function getHtmlEntries() {
  const entries = {
    main: resolve(__dirname, 'index.html'),
    about: resolve(__dirname, 'about.html'),
    brand_portfolio: resolve(__dirname, 'brand_portfolio.html'),
    contact: resolve(__dirname, 'contact.html'),
    shilajit: resolve(__dirname, 'shilajit.html'),
    shop: resolve(__dirname, 'shop.html'),
  };

  // Also include any HTML files located in src/ or root dynamically
  const scanDirs = [__dirname, resolve(__dirname, 'src')];
  scanDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        if (file.endsWith('.html')) {
          const name = file.replace(/\.html$/, '');
          const entryKey = dir === __dirname && name === 'index' ? 'main' : name;
          if (!entries[entryKey]) {
            entries[entryKey] = resolve(dir, file);
          }
        }
      });
    }
  });

  return entries;
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-static-folders',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist');
        const jsDir = resolve(__dirname, 'js');
        const imgDir = resolve(__dirname, 'images');

        if (fs.existsSync(jsDir)) {
          fs.cpSync(jsDir, resolve(distDir, 'js'), { recursive: true });
        }
        if (fs.existsSync(imgDir)) {
          fs.cpSync(imgDir, resolve(distDir, 'images'), { recursive: true });
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: getHtmlEntries(),
    },
  },
});
