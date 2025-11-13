import { defineConfig } from 'vite';

// React without plugin-react: rely on esbuild JSX transform
export default defineConfig({
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
    },
    server: { port: 5173 },
});
