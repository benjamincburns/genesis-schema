import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "system-component.json");

describe("system-component.json", () => {

  test("should validate with full properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with minimal properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/minimal.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should not validate without type property", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-type.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "required",
        schemaPath: "#/required",
      },
    ]);
  });

  test("should not validate with spaces in type property", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-type.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/type/pattern",
      },
    ]);
  });

  test("should not validate with spaces in name property", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/name/pattern",
      },
    ]);
  });

  test("should not validate with invalid port mapping", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-port-mapping.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/port-mappings/items/pattern",
      },
    ]);
  });

  test("should not validate with missing sidecar type", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/missing-sidecar-type.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "required",
        schemaPath: "#/properties/sidecars/items/required",
      },
    ]);
  });

  test("should not validate with invalid sidecar type", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-sidecar-type.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/sidecars/items/properties/type/pattern",
      },
    ]);
  });

  test("should not validate with invalid sidecar name", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-sidecar-name.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "pattern",
        schemaPath: "#/properties/sidecars/items/properties/name/pattern",
      },
    ]);
  });

  test("should not validate with negative count", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-count-negative.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "minimum",
        schemaPath: "#/properties/count/minimum",
      },
    ]);
  });

  test("should not validate with fractional count", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-count-fractional.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
      {
        keyword: "multipleOf",
        schemaPath: "#/properties/count/multipleOf",
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
