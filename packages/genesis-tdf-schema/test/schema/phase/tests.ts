import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "phase.json");

describe("phase.json", () => {

  test("should validate with full properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with minimal properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/minimal.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should not validate without name field", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "required",
            schemaPath: "#/required",
        },
    ]);
  });

  test("should not validate with invalid name", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "pattern",
            schemaPath: "#/properties/name/pattern",
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
