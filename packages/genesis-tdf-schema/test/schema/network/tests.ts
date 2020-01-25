import { validateDocument, validateErroneousDocument } from "../test-helper";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "..", "..", "..", "src", "schema", "network.json");

describe("network.json", () => {

  test("should validate without optional properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/minimal.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with optional properties", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full.yaml");
    await validateDocument(testDocumentPath, schemaPath);
  });

  test("should validate with suffixes on the network parameters", async () => {
    const testDocumentPath = path.resolve(__dirname, "valid/full-suffixes.yaml");
    await validateDocument(testDocumentPath, schemaPath);
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

  test("should not validate with invalid bandwidth suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-bandwidth-suffix.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "pattern",
            schemaPath: "#/properties/bandwidth/pattern",
        },
    ]);
  });

  test("should not validate with invalid latency suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-latency-suffix.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "pattern",
            schemaPath: "#/properties/latency/pattern",
        },
    ]);
  });

  test("should not validate with invalid packet loss suffix", async () => {
    const testDocumentPath = path.resolve(__dirname, "invalid/invalid-packet-loss-suffix.yaml");
    await validateErroneousDocument(testDocumentPath, schemaPath, [
        {
            keyword: "pattern",
            schemaPath: "#/properties/packet-loss/pattern",
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
