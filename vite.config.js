import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend-qms.fortuneitpark.com",
        changeOrigin: true,
        secure: false, // Ignore SSL certificate errors
      },
    },
  },
});


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     //port: 3000,  // ← add this
//     proxy: {
//       "/api": {
//         target: "http://backend-qms.fortuneitpark.com",
//         changeOrigin: true,
//         secure: false,
//         headers: {
//           "Host": "backend-qms.fortuneitpark.com",
//           "Accept": "application/json",
//           "Content-Type": "application/json"
//         }
//       },
//     },
//   },
// });

