import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "resources.json");

describe("resources.json", () => {

  test("should validate with empty object", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/minimal.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with full properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with full properties and suffixes on values", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full-suffixes.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should not validate with invalid memory suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/bad-memory-suffix.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "pattern",
            schemaPath: "#/properties/memory/pattern",
        },
    ]);
  });

  test("should not validate with invalid storage suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/bad-storage-suffix.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "pattern",
            schemaPath: "#/properties/storage/pattern",
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
