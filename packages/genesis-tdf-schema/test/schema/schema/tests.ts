import {validateDocument, validateErroneousDocument} from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "schema.json");

describe("schema.json", () => {

  test("should validate with full properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate without task runners", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/no-tasks.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with missing sidecar name", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-sidecar-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "required",
        schemaPath: "#/properties/sidecars/items/required",
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
