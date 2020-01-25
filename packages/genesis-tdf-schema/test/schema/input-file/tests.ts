import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "input-file.json");

describe("input-file.json", () => {

  test("should validate", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
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

  test("should not validate without destination-path", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-destination-path.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "required",
            schemaPath: "#/required",
        },
    ]);
  });

  test("should not validate without source-path", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-source-path.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "required",
            schemaPath: "#/required",
        },
    ]);
  });
});
