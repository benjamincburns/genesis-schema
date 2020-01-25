import merge from "lodash.merge";
import * as jsonPtr from "json-ptr";
import * as utils from "genesis-string-utils";
import * as schemaComponents from "./schemaComponents";

/**
 * Loads and returns the JSON Schema that describes Whiteblock Genesis's Test
 * Definition Format.
 *
 * The schema is actually defined as a bunch of normalized subschema, each in
 * its own file. When loading we resolve references to these subschema,
 * producing a fully populated schema that requires no additional resolution of
 * references.
 *
 * @returns JSON Schema object for Whiteblock Genesis's Test Definition Format.
 */
export async function getRootSchema(): Promise<any> {
  return resolveSchema("schema.json");
}

export default getRootSchema;

const _schemaCache: any = {};

/**
 *
 * Helper function that loads arbitrary subschema files, resolving the
 * references they contain to other subschema along the way.
 *
 * @param url the URL of the schema to resolve
 */
export async function resolveSchema(url: string): Promise<any> {
  const filename = utils.getJsonFilenameFromUrl(url);
  if (!filename) {
    throw new Error(`No filename found in URL '${URL}'`);
  }

  // map to known schema name (schema -> rootSchema, otherwise kebab-case ->
  // camelCase)
  const schemaName = (filename === "schema.json") ?
    "rootSchema" :
    utils.toCamelCase(filename.replace(".json", ""));

  if (_schemaCache[schemaName]) {
    return _schemaCache[schemaName];
  }

  // cast to any gets around TypeScript complaining about missing index signature
  if (!(schemaComponents as any)[schemaName]) {
    throw new Error(
      `Cannot find schema '${filename}' (alias '${schemaName}') in list of known schema. ` +
      `Known schema aliases are ${Object.keys(schemaComponents).join(", ")}.` +
      `Make sure it has been exported from schemaComponents.ts`,
    );
  }

  const unexpandedSchema = (schemaComponents as any)[schemaName];

  const expandedSchema = await _dereferenceSchema(unexpandedSchema);

  _schemaCache[schemaName] = expandedSchema;
  return expandedSchema;
}

/**
 * This function produces a new JSON Schema object from the one that it is
 * passed, but with references to other JSON Schema replaced with the contents
 * of those schema.
 *
 * @param schema the schema definition that needs to be dereferenced
 * @param parent Tracks the root level of the schema file that is being
 * processed so that internal schema references can be resolved. Only specified
 * when called recursively.
 *
 * @returns a new JSON Schema object with all references resolved
 */
async function _dereferenceSchema(schema: any, parent?: any): Promise<any> {

  if (!parent) {
    parent = schema;
  }

  // if it has a ref field, resolve it.
  if (schema.hasOwnProperty("$ref")) {
    const newVersion = merge({}, schema);
    delete newVersion.$ref;

    const resolvedSubschema = await _fetchReferenceFromSchema(schema, parent);
    return merge({}, newVersion, resolvedSubschema);
  }

  // if it's an array, clone it, looking for refs in its values
  if (Array.isArray(schema)) {
    const newVersion = [];
    for (const item of schema) {
      newVersion.push(await _dereferenceSchema(item, parent));
    }

    return newVersion;
  }

  if (typeof schema === "object") {
    const newVersion: any = {};
    for (const propertyName of Object.keys(schema)) {
      if (propertyName === "allOf") {
        const components = await Promise.all(
          schema[propertyName].map((val: any) => _dereferenceSchema(val, parent)),
        );
        merge(newVersion, ...components);
      } else {
        newVersion[propertyName] = await _dereferenceSchema(schema[propertyName], parent);
      }
    }

    return newVersion;
  }

  if (typeof schema === "function") {
    return schema;
  }

  // finally, just return scalars as-is
  return schema;
}

async function _fetchReferenceFromSchema(schema: any, parent: any): Promise<any> {
  try {
    const result = await resolveSchema(schema.$ref);
    const fragmentId = schema.$ref.split("#")[1];

    // delete extraneous/unnecessary fields
    delete result.$id;
    delete result.$schema;
    delete result.definitions;

    if (fragmentId) {
      return jsonPtr.get(result, `#${fragmentId}`);
    }

    return result;
  } catch {
    const subschema = jsonPtr.get(parent, schema.$ref);
    return _dereferenceSchema(merge({}, subschema), parent);
  }
}
