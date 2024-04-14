import { defineConfig } from 'cypress';
function getURI() {
  const PORT = process.env.PORT ? process.env.PORT : 3000;
  return `http://localhost:${PORT}`;
}
export default defineConfig({
  projectId: "f968uc",
  e2e: {
    baseUrl: getURI(),
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
