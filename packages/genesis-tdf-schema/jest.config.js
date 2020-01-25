const path = require("path");
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [path.join(__dirname, "test/", "**", "*.ts")],
  testPathIgnorePatterns: [ "/node_modules/", "test-helper\\.ts" ]
};
