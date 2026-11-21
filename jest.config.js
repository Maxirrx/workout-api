/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFiles: ["reflect-metadata"],
  roots: ["<rootDir>/src"], // À adapter si vos tests sont dans un dossier /tests
  testMatch: ["**/*.test.ts"],
  transform: { "^.+\\.(t|j)sx?$": "@swc/jest" }
};
