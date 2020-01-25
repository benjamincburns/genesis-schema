import * as assert from "assert";
import * as utils from "../src/";

describe("toCamelCase", () => {
    test("should produce camelCase from kebab-case", () => {
        assert.strictEqual(utils.toCamelCase("make-this-camel-case"), "makeThisCamelCase");
    });

    test("should produce camelCase from PascalCase", () => {
        assert.strictEqual(utils.toCamelCase("MakeThisCamelCase"), "makeThisCamelCase");
    });

    test("should leave text that is already camelCase as-is", () => {
        assert.strictEqual(utils.toCamelCase("alreadyCamelCase"), "alreadyCamelCase");
    });
});

describe("toPascalCase", () => {
    test("should produce PascalCase from kebab-case", () => {
        assert.strictEqual(utils.toPascalCase("make-this-pascal-case"), "MakeThisPascalCase");
    });

    test("should produce PascalCase from camelCase", () => {
        assert.strictEqual(utils.toPascalCase("makeThisPascalCase"), "MakeThisPascalCase");
    });

    test("should leave text that is already PascalCase as-is", () => {
        assert.strictEqual(utils.toPascalCase("AlreadyPascalCase"), "AlreadyPascalCase");
    });

    test("should produce PascalCase from kebab-case, allow first letter to be lowercase", () => {
        assert.strictEqual(utils.toPascalCase("make-this-pascal-case", false), "makeThisPascalCase");
    });
});

describe("toSnakeCase", () => {
    test("should produce SnakeCase from kebab-case", () => {
        assert.strictEqual(utils.toSnakeCase("make-this-pascal-case"), "make_this_pascal_case");
    });

    test("should produce SnakeCase from camelCase", () => {
        assert.strictEqual(utils.toSnakeCase("makeThisPascalCase"), "make_this_pascal_case");
    });

    test("should leave text that is already SnakeCase as-is", () => {
        assert.strictEqual(utils.toSnakeCase("already_snake_case"), "already_snake_case");
    });
});

describe("toKebabCase", () => {
    test("should produce kebab-case from camelCase", () => {
        assert.strictEqual(
            utils.toKebabCase("makeThisKebabCase"),
            "make-this-kebab-case",
        );
    });

    test("should produce kebab-case from PascalCase", () => {
        assert.strictEqual(
            utils.toKebabCase("MakeThisKebabCase"),
            "make-this-kebab-case",
        );
    });

    test("should leave text that is already kebab-case as-is", () => {
        assert.strictEqual(
            utils.toKebabCase("already-kebab-case"),
            "already-kebab-case",
        );
    });

    test("should lowercase text from camelCase even when it's not at a lower-to-upper transition", () => {
        assert.strictEqual(
            utils.toKebabCase("textWithAcronymABCD"),
            "text-with-acronym-abcd",
        );
    });
});

describe("getJsonFilenameFromUrl", () => {
    test("should return filename from full URL with fragment", () => {
        assert.strictEqual(
            utils.getJsonFilenameFromUrl("https://example.com/path/to/filename.json#/json/ptr"),
            "filename.json",
        );
    });

    test("should return filename from URL without fragment", () => {
        assert.strictEqual(
            utils.getJsonFilenameFromUrl("https://example.com/path/to/filename.json"),
            "filename.json",
        );
    });

    test("should return filename as-is if passed unwrapped in URL", () => {
        assert.strictEqual(
            utils.getJsonFilenameFromUrl("filename.json"),
            "filename.json",
        );
    });

    test("should return filename if passed unwrapped in URL, but with fragment", () => {
        assert.strictEqual(
            utils.getJsonFilenameFromUrl("filename.json#/json/ptr"),
            "filename.json",
        );
    });
});

describe("basename", () => {
    test("should return filename without extension", () => {
        assert.strictEqual(
          utils.basename("filename.json"),
          "filename",
        );
    });

    test("should return filename without multiple extensions", () => {
        assert.strictEqual(
          utils.basename("filename.tar.gz"),
          "filename",
        );
    });

    test("should return filename as is if no extensions", () => {
        assert.strictEqual(
          utils.basename("filename"),
          "filename",
        );
    });
});
