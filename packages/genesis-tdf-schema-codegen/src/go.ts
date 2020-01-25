import { Schema } from "./types";
import { getTypeNameFromRef, getPublicNameFromSchemaPropertyName } from "./localStringUtils";
import { collapseAllOf } from "./collapse";
import { fieldFromProperty } from "./convert";

export const converters = {
    string: _stringFieldFromProperty,
    number: _numberFieldFromProperty,
    integer: _integerFieldFromProperty,
    boolean: _booleanFieldFromProperty,
    object: _objectFieldFromProperty,
    array: _arrayFieldFromProperty,
    null: (..._: any[]) => { throw new Error("Cannot handle null property types"); },
    ref: _refFieldFromProperty,
};

export function masterTemplate(outputTypeName: string, properties: string[], packageName: string) {
  return `package ${packageName}\n\ntype ${outputTypeName} struct {\n${properties.join("\n")}\n}\n`;
}

function _numberFieldFromProperty(propertyName: string, property: Schema, arrayDepth: number, indentDepth: number): string {
    if (property.multipleOf === 1) {
        return _integerFieldFromProperty(propertyName, property, arrayDepth, indentDepth);
    }

    return _simpleFieldFromProperty(propertyName, "float64", arrayDepth, indentDepth);
}

function _integerFieldFromProperty(propertyName: string, property: Schema, arrayDepth: number, indentDepth: number): string {
    if (property.minimum >= 0) {
        return _simpleFieldFromProperty(propertyName, "uint64", arrayDepth, indentDepth);
    }

    return _simpleFieldFromProperty(propertyName, "int64", arrayDepth, indentDepth);
}

function _booleanFieldFromProperty(propertyName: string, _: Schema, arrayDepth: number, indentDepth: number): string {
    return _simpleFieldFromProperty(propertyName, "bool", arrayDepth, indentDepth);
}

function _stringFieldFromProperty(propertyName: string, _: Schema, arrayDepth: number, indentDepth: number): string {
    return _simpleFieldFromProperty(propertyName, "string", arrayDepth, indentDepth);
}

function _arrayFieldFromProperty(propertyName: string, property: Schema, arrayDepth: number, indentDepth: number) {
    if (Array.isArray(property.items)) {
        throw new Error(`Don't know how to deal with arrays of items for simple array types at property name ${propertyName}`);
    }

    return fieldFromProperty(propertyName, property.items, "go", arrayDepth + 1, indentDepth);
}

function _objectFieldFromProperty(propertyName: string, property: Schema, arrayDepth: number, indentDepth: number): string {
    if (!property.properties && property.oneOf) {
        property = collapseAllOf(property.oneOf);
    }

    if (property.allOf) {
        property = collapseAllOf(property.allOf);
    }

    if (!property.properties) {
        const line =  `${getPublicNameFromSchemaPropertyName(propertyName)}\tmap[string]string ${_getFieldTag(propertyName)}`;
        return indentLine(line, indentDepth);
    }

    const propertyNames = Object.keys(property.properties);
    const properties = propertyNames.map(
        (name) => fieldFromProperty(name, property.properties[name], "go", 0, indentDepth + 1),
    );

    const outputTypeName = getPublicNameFromSchemaPropertyName(propertyName);

    const arrayPrefix = "[]".repeat(arrayDepth);
    const preamble = `${outputTypeName} ${arrayPrefix}struct {\n`;
    const body = properties.join("\n") + "\n";
    const postamble = `} ${_getFieldTag(propertyName)}`;

    return indentLine(preamble, indentDepth) +
        body + // already indented properly
        indentLine(postamble, indentDepth);

}

function _refFieldFromProperty(propertyName: string, property: Schema, arrayDepth: number, indentDepth: number) {
    const outputTypeName = getTypeNameFromRef(property.$ref);
    return _simpleFieldFromProperty(propertyName, outputTypeName, arrayDepth, indentDepth);
}

function _simpleFieldFromProperty(propertyName: string, outputTypeName: string, arrayDepth: number, indentDepth: number): string {
    const arrayPrefix = "[]".repeat(arrayDepth);

    // Name\tType `yaml:"yaml-property-name,omitempty" json:"yaml-property-name,omitempty"`
    const line = getPublicNameFromSchemaPropertyName(propertyName) +
        "\t" +
        arrayPrefix +
        outputTypeName +
        " " +
        _getFieldTag(propertyName);

    return indentLine(line, indentDepth);
}

function _getFieldTag(propertyName: string) {
    return `\`yaml:"${propertyName},omitempty" json:"${propertyName},omitempty"\``;
}

export function indentLine(line: string, indentDepth: number): string {
    return "\t".repeat(indentDepth) + line;
}
