import { schemaComponents } from "genesis-tdf-schema";
import { Schema } from "./types";
import { structFromSchema } from "./convert";
import { toSnakeCase } from "genesis-string-utils";
import * as fs from "fs";
import * as path from "path";

const stdout = console;

export function main() {
  const components = Object.keys(schemaComponents);

  const lang = process.argv[2].toLowerCase();
  if (lang !== "go" && lang !== "typescript") {
    throw new Error(`Language (first argument) must be either 'go' or 'typescript'. Was '${lang}'`);
  }

  const unresolvedPathPrefix = process.argv[3] || "./";
  const pathPrefix = path.resolve(unresolvedPathPrefix);

  if (!fs.existsSync(pathPrefix)) {
    fs.mkdirSync(pathPrefix, { recursive: true });
  }

  let tsOutput = "";

  for (const schemaName of components) {

    stdout.log(`Working on schema ${schemaName}.`);

    const packageName = process.argv[4] || "main";

    const schema = (schemaComponents as any)[schemaName] as Schema;
    const struct = structFromSchema(schemaName, schema, packageName, lang);

    if (lang === "go") {
      dumpGo(schemaName, struct, pathPrefix, unresolvedPathPrefix);
    } else if (lang === "typescript") {
      tsOutput = struct + "\n" + tsOutput;
    }
  }

  if (lang === "typescript") {
    dumpTs(tsOutput, pathPrefix, unresolvedPathPrefix);
  }
}

function dumpGo(schemaName: string, struct: string, pathPrefix: string, unresolvedPathPrefix: string) {
  const extension = ".go";
  const outputFileName = toSnakeCase(schemaName) + extension;

  stdout.log(`Writing schema ${schemaName} to ${path.join(unresolvedPathPrefix, outputFileName)}.`);

  const outputPath = path.join(pathPrefix, outputFileName);
  fs.writeFileSync(outputPath, struct);

  stdout.log(`Done.`);
}

function dumpTs(struct: string, pathPrefix: string, unresolvedPathPrefix: string) {
  const outputFileName = "index.ts";

  stdout.log(`Writing schema to ${path.join(unresolvedPathPrefix, outputFileName)}.`);

  const outputPath = path.join(pathPrefix, outputFileName);
  fs.writeFileSync(outputPath, struct);

  stdout.log(`Done.`);
}

export default main;

// if we're called from the command line, fire off the main function
if (require.main === module) {
  main();
}
