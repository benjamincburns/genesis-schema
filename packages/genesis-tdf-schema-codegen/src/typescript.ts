import * as utils from "genesis-string-utils";
import { Schema } from "./types";
import { getTypeNameFromRef } from "./localStringUtils";
import { collapseAllOf } from "./collapse";
import { fieldFromProperty } from "./convert";

export const converters = {
    string: _stringFieldFromProperty,
    number: _numberFieldFromProperty,
    integer: _numberFieldFromProperty,
    boolean: _booleanFieldFromProperty,
    object: _objectFieldFromProperty,
    array: _arrayFieldFromProperty,
    null: (..._: any[]) => { throw new Error("Cannot handle null property types"); },
    ref: _refFieldFromProperty,
};

export function masterTemplate(outputTypeName: string, properties: string[], _: string) {
  return `export interface I${outputTypeName} {\n${properties.join(";\n")};\n}\n`;
}

function _numberFieldFromProperty(propertyName: string, _: Schema, arrayDepth: number, indentDepth: number): string {
    return _simpleFieldFromProperty(propertyName, "number", arrayDepth, indentDepth);
}

function _booleanFieldFromProperty(propertyName: string, _: Schema, arrayDepth: number, indentDepth: number): string {
    return _simpleFieldFromProperty(propertyName, "boolean", arrayDepth, indentDepth);
}

function _stringFieldFromProperty(propertyName: string, _: Schema, arrayDepth: number, indentDepth: number): string {
    return _simpleFieldFromProperty(propertyName, "string", arrayDepth, indentDepth);
}

function _arrayFieldFromProperty(propertyName: string, property: Schema, arrayDepth: number, indentDepth: number) {
    if (Array.isArray(property.items)) {
        throw new Error(`Don't know how to deal with arrays of items for simple array types at property name ${propertyName}`);
    }

    return fieldFromProperty(propertyName, property.items, "typescript", arrayDepth + 1, indentDepth);
}

function _objectFieldFromProperty(propertyName: string, property: Schema, arrayDepth: number, indentDepth: number): string {
    if (!property.properties && property.oneOf) {
        property = collapseAllOf(property.oneOf);
    }

    if (property.allOf) {
        property = collapseAllOf(property.allOf);
    }

    if (!property.properties) {
        const line = `${utils.toCamelCase(propertyName)}: Map<string, string>`;
        return indentLine(line, indentDepth);
    }

    const propertyNames = Object.keys(property.properties);
    const properties = propertyNames.map(
        (name) => fieldFromProperty(name, property.properties[name], "typescript", 0, indentDepth + 1),
    );

    // TODO indent level everywhere
    properties.map((p) => indentLine(p, 1));

    const outputTypeName = utils.toCamelCase(propertyName);
    const arrayPrefix = "Array<".repeat(arrayDepth);
    const arraySuffix = ">".repeat(arrayDepth);

    const preamble = `${outputTypeName}: ${arrayPrefix}{\n`;
    const body = properties.join(";\n") + ";\n";
    const postamble = `}${arraySuffix}`;

    return indentLine(preamble, indentDepth) +
        body + // already indented
        indentLine(postamble, indentDepth);
}

function _refFieldFromProperty(propertyName: string, property: Schema, arrayDepth: number, indentDepth: number) {
    const outputTypeName = "I" + getTypeNameFromRef(property.$ref);
    return _simpleFieldFromProperty(propertyName, outputTypeName, arrayDepth, indentDepth);
}

function _simpleFieldFromProperty(propertyName: string, outputTypeName: string, arrayDepth: number, indentDepth: number): string {
    const arraySuffix = "[]".repeat(arrayDepth);
    const line = utils.toCamelCase(propertyName) +
        ": " +
        outputTypeName +
        arraySuffix;

    return indentLine(line, indentDepth);
}

export function indentLine(line: string, indentDepth: number): string {
    return "    ".repeat(indentDepth) + line;
}
