import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "process.json");

describe("process.json", () => {

  test("should validate with image only", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/minimal-image.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with script only", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/minimal-script.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with full properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should not validate without image or script property", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/no-script-or-image.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "required",
            schemaPath: "#/anyOf/0/required",
        },
        {
            keyword: "required",
            schemaPath: "#/anyOf/1/required",
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
