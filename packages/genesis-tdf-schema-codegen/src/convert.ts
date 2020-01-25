// import fs from "fs";
import { getTypeNameFromRef } from "./localStringUtils";
import { Schema, Language } from "./types";
import { collapseAllOf } from "./collapse";

import * as go from "./go";
import * as typescript from "./typescript";

const languages = {
    go,
    typescript,
};

import merge from "lodash.merge";

export function structFromSchema(filename: string, schema: Schema, packageName: string, lang: Language) {
    if (!schema.properties && schema.oneOf) {
        // not totally sure if this is safe, but we'll see!
        schema = collapseAllOf(schema.oneOf);
    }

    if (schema.allOf) {
        schema = collapseAllOf(schema.allOf);
    }

    const propertyNames = Object.keys(schema.properties);
    const properties = propertyNames.map(
        (propertyName) => fieldFromProperty(propertyName, schema.properties[propertyName], lang, 0, 1),
    );

    const outputTypeName = getTypeNameFromRef(filename);

    if (languages[lang]) {
        return languages[lang].masterTemplate(outputTypeName, properties, packageName);
    } else {
        throw new Error(`Unrecognized language '${lang}'. Must be either 'go' or 'typescript'`);
    }
}

export default structFromSchema;

export function fieldFromProperty(propertyName: string, property: Schema, lang: Language, arrayDepth: number = 0, indentDepth: number = 0): string {
    if (property.type && Array.isArray(property.type)) {
        // handle type: [string, number] as string
        if (property.type.length === 2 && property.type.indexOf("number") >= 0 && property.type.indexOf("string") >= 0) {
            // replace `type: [string, number]` with `type: string` since we'll treat numbers as strings in this case
            property = merge({}, property, { type: "string" });
        } else {
            // otherwise, just throw an error, we don't know how to handle this type
            throw new Error(`Don't know how to handle compound type [${property.type.join(", ")}], please add custom handler`);
        }
    }

    return _fieldFromSingleTypeProperty(propertyName, property, lang, arrayDepth, indentDepth);
}

function _fieldFromSingleTypeProperty(propertyName: string, property: Schema, lang: Language, arrayDepth: number, indentDepth: number): string {
    if (property.$ref) {
        return languages[lang].converters.ref(propertyName, property, arrayDepth, indentDepth);
    }

    if (property.allOf) {
        property = collapseAllOf(property.allOf);
    }

    if (!property.properties && property.oneOf) {
        // not 100% sure if this is safe yet, but we'll try and see
        property = collapseAllOf(property.oneOf);
    }

    if (!Array.isArray(property.type)) {
        return languages[lang].converters[property.type](propertyName, property, arrayDepth, indentDepth);
    } else {
        throw new Error("Cannot handle property types that are arrays in '_fieldFromSingleTypeProperty'.");
    }
}
