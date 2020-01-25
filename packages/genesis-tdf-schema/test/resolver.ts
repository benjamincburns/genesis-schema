import { getRootSchema } from "../src/resolver";
import assert from "assert";

describe("resolver.ts", () => {

  const schemaLOCFailureThreshold = 2000;
  test(`schema size should be <= ${schemaLOCFailureThreshold} LOC`, async () => {
    const rootSchema = await getRootSchema();
    const prettySchema = JSON.stringify(rootSchema, null, 2);
    const schemaLOC = prettySchema.split(/\r\n|\r|\n/).length;

    assert(
      schemaLOC < schemaLOCFailureThreshold,
      `The resolved schema has grown to ${schemaLOC} lines of code when ` +
      `formatted for human readability. This test fails when the schema is ` +
      `${schemaLOCFailureThreshold} lines of code or more. If you have ` +
      `recently made significant schema additions, you may want to update ` +
      `this test. Otherwise, this test failure indicates a likely bug in ` +
      `the resolver code that flattens the schema.`,
    );
  });
});
