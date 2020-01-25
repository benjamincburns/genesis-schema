import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "script.json");

describe("script.json", () => {

  test("validation should pass when only inline is specified", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/inline-only.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("validation should pass when only source-path is specified", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/source-path-only.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("validation should fail when inline and source-path are both specified", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/both-fields.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "not",
        schemaPath: "#/oneOf/0/not",
      },
      {
        keyword: "not",
        schemaPath: "#/oneOf/1/not",
      },
      {
        keyword: "oneOf",
        schemaPath: "#/oneOf",
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
