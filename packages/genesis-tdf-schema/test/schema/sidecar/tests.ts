import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "sidecar.json");

describe("sidecar.json", () => {

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

  test("should not validate with invalid name field", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/name/pattern",
      },
    ]);
  });

  test("should not validate without sidecar-to property", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-sidecar-to-field.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "required",
        schemaPath: "#/required",
      },
    ]);
  });

  test("should not validate with invalid sidecar-to service name", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-service-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/sidecar-to/items/pattern",
      },
    ]);
  });

  test("should not validate with sidecar-to array that contains duplicate service names", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/duplicate-service-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "uniqueItems",
        schemaPath: "#/properties/sidecar-to/uniqueItems",
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
