import { defineConfig } from "vite";

export default defineConfig({
  base: "/sportsProject/", 
  build: {
    outDir: "dist", 
    minify: false, 
    rollupOptions: {
      input: {
        main: "index.html",
        team: "src/team.html",
        teamDetails: "src/team-details.html",
      },
    },
  },
  define: {
    "process.env": {},
  }
});