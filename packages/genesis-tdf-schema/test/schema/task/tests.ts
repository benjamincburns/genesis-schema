import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "task.json");

describe("task.json", () => {

  test("should validate with full properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with image only", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/minimal.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with no timeout suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/no-timeout-suffix.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with ms timeout suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/ms-timeout-suffix.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with s timeout suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/s-timeout-suffix.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with m timeout suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/m-timeout-suffix.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with infinite timeout", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/infinite-timeout.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should not validate with invalid timeout suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-timeout-suffix.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/timeout/pattern",
      },
    ]);
  });

  test("should not validate with negative timeout", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-timeout-negative-number.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "minimum",
        schemaPath: "#/properties/timeout/minimum",
      },
    ]);
  });

  test("should not validate with invalid type field", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-type.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/type/pattern",
      },
    ]);
  });

  test("should not validate with additional properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/additional-properties.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "additionalProperties",
        schemaPath: "#/additionalProperties",
      },
    ]);
  });
});
