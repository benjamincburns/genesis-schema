import * as fs from "fs";
import Ajv from "ajv";
import * as anyJson from "any-json";
import * as assert from "assert";
import { promisify } from "util";
import { resolveSchema } from "../../src/";

const readFile = promisify(fs.readFile);

export class ValidationError extends Error {
  public errors: Ajv.ErrorObject[];

  constructor(message: string, errors?: Ajv.ErrorObject[] | null) {
    super(message);
    if (errors) {
      this.errors = errors;
    } else {
      this.errors = [];
    }
  }
}

export interface IErrorPattern {
  keyword: string;
  schemaPath: string;
}

export async function validateDocument(filePath: string, schemaPath: string) {
  const schema = await resolveSchema(schemaPath);

  const yaml = await readFile(filePath, { encoding: "utf-8" });
  const json = await anyJson.decode(yaml, "yaml");

  const ajv = new Ajv({
    loadSchema: resolveSchema,
    allErrors: false,
    jsonPointers: true,
    verbose: true,
  });

  const validator = await ajv.compileAsync(schema);

  const isValid = await validator(json);
  if (!isValid) {
    throw _getError(filePath, validator.errors);
  }
}

/**
 * Internal helper function to create helpful error messages on validation failures.
 * @param filePath The path to the document being validated
 * @param errors the errors to examine.
 */
function _getError(filePath: string, errors?: Ajv.ErrorObject[] | null): ValidationError {
  if (errors) {
    const unexpectedProperties = [];
    for (const err of errors) {
      // ugly hack because for some reason AJVs typings don't expose the
      // AdditionalPropertiesParams interface correctly
      if (err && err.params && (err.params as any).additionalProperty) {
        unexpectedProperties.push((err.params as any).additionalProperty);
      }
    }

    if (unexpectedProperties.length > 0) {
      return new ValidationError(`Error validating YAML document at path ${filePath}: ${new Ajv().errorsText(errors)}. Unexpected properties: ${unexpectedProperties.join(", ")}`, errors);
    } else {
      return new ValidationError(`Error validating YAML document at path ${filePath}: ${new Ajv().errorsText(errors)}`, errors);
    }
  } else {
    return new ValidationError(`Error validating YAML document at path ${filePath}. Unfortunately no error was specified by AJV. This is likely a bug.`);
  }
}

export async function validateErroneousDocument(filePath: string, schemaPath: string, expectedErrors: IErrorPattern[]) {
    try {
      await validateDocument(filePath, schemaPath);
      assert.fail("Expected validation error, but none occurred");
    } catch (err) {
      if (!(err instanceof ValidationError)) {
        throw err;
      }

      // loop through the expected errors and make sure that they're all accounted for
      // ignores extra errors, however
      for (const expectedError of expectedErrors) {
        let matchFound = false;
        for (const observedError of err.errors) {
          matchFound = expectedError.keyword === observedError.keyword &&
            expectedError.schemaPath === observedError.schemaPath;

          if (matchFound) {
            break;
          }
        }

        const errorDescriptions = err.errors.map((error) => {
          return `\t'${error.keyword}' at '${error.schemaPath}'`;
        }).join(",\n");

        assert.strictEqual(matchFound, true, `Expected error '${expectedError.keyword}' at schema path '${expectedError.schemaPath}', but it wasn't found. Observed errors: \n${errorDescriptions}`);
      }
    }
}
