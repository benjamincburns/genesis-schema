import { Schema } from "./types";
import { schemaComponents } from "genesis-tdf-schema";
import merge from "lodash.merge";
import * as utils from "genesis-string-utils";

export function collapseAllOf(allOf: Schema[]): Schema {
    const components: Schema[] = [];
    for (const schema of allOf) {
        if (schema.$ref) {
            const filename = utils.getJsonFilenameFromUrl(schema.$ref);
            if (!filename) {
                throw new Error(`No filename found in URL '${URL}'`);
            }
            const schemaName = (filename === "schema.json") ?
                "rootSchema" :
                utils.toCamelCase(filename.replace(".json", ""));

            const resolvedSchema = (schemaComponents as any)[schemaName];

            if (resolvedSchema.allOf) {
                components.push(merge({}, collapseAllOf(resolvedSchema.allOf)));
            } else if (!resolvedSchema.properties && resolvedSchema.oneOf) {
                components.push(merge({}, collapseAllOf(resolvedSchema.oneOf)));
            } else {
                components.push(merge({}, resolvedSchema));
            }
        } else {
            components.push(merge({}, schema));
        }
    }

    return merge({}, ...components);
}
