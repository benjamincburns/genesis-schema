import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "volume.json");

describe("volume.json", () => {

  test("should validate with full properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with underscore in name", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full-underscore-name.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should not validate with space in name", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "pattern",
            schemaPath: "#/properties/name/pattern",
        },
    ]);
  });

  test("should not validate without name property", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "required",
            schemaPath: "#/required",
        },
    ]);
  });

  test("should not validate without path property", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-path.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "required",
            schemaPath: "#/required",
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
