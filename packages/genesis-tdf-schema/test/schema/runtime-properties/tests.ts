import {validateDocument, validateErroneousDocument} from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "runtime-properties.json");

describe("runtime-properties.json", () => {

  test("should validate as empty object", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/minimal.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with full properties", async () => {
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
});
