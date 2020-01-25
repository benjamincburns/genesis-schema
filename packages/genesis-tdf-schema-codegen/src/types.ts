export type Language = "go" | "typescript";

export interface IProperties {
    [index: string]: Schema;
}

export interface IPatternProperties {
    [index: string]: Schema;
}

export interface IDependencies {
    [index: string]: string[] | Schema;
}

export interface IBaseSchema {
    $id: string;
    $schema: string;
    $ref: string;
    type: SchemaType | SchemaType[];
    default: any;
}

export interface IStringSchema {
    pattern: string;
    minLength: number;
    maxLength: number;
    format: StringFormats;
}

export interface INumericSchema {
    multipleOf: number;
    minimum: number;
    exclusiveMinimum: number;
    maximum: number;
    exclusiveMaximum: number;
}

export interface IObjectSchema {
    properties: IProperties;
    required: string[];
    additionalProperties: boolean;
    propertyNames: IStringSchema;
    patternProperties: IPatternProperties;
    minProperties: number;
    maxProperties: number;
    dependencies: IDependencies;
}

export interface IArraySchema {
    items: Schema | Schema[];
    contains: Schema;
    additionalItems: boolean;
    minItems: number;
    maxItems: number;
    uniqueItems: boolean;
}

export interface IOneOf {
    oneOf: Schema[];
}

export interface IAnyOf {
    anyOf: Schema[];
}

export interface IAllOf {
    allOf: Schema[];
}

export interface INot {
    not: Schema[];
}

export type StringFormats =
  "date-time" |
  "date" |
  "time" |
  "email" |
  "idn-email" |
  "hostname" |
  "idn-hostname" |
  "ipv4" |
  "ipv6" |
  "uri" |
  "uri-reference" |
  "uri-template" |
  "iri" |
  "iri-reference" |
  "json-pointer" |
  "relative-json-pointer" |
  "regex";

export type SchemaType =
  "string" |
  "integer" |
  "number" |
  "object" |
  "array" |
  "boolean" |
  "null";

export type Schema =
  IBaseSchema &
  IOneOf &
  IAnyOf &
  IAllOf &
  INot &
  IStringSchema &
  INumericSchema &
  IObjectSchema &
  IArraySchema;

export default Schema;
