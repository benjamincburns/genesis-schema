import * as utils from "genesis-string-utils";

// Note: only place items in this module if they wouldn't be useful to other
// packages in the monorepo. For string manipulation that would be useful for
// other packages, put it in `genesis-string-utils`

export function getTypeNameFromRef(filename: string): string {
    let baseName = utils.getJsonFilenameFromUrl(filename);

    if (baseName === undefined) {
        // didn't pass in `.json` filename after all...
        baseName = getPublicNameFromSchemaPropertyName(filename);
    }
    baseName = utils.basename(baseName);

    return utils.toPascalCase(baseName as string);
}

export function getPublicNameFromSchemaPropertyName(propertyName: string): string {
    return utils.toPascalCase(propertyName);
}
