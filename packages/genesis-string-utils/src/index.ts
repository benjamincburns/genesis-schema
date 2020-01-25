export function toCamelCase(str: string): string {
  return str.replace(
    /-([a-zA-Z])/g,
    (g) => g[1].toUpperCase(),
  ).replace(
    /^[A-Z]/,
    (g) => g.toLowerCase(),
  );
}

export function toPascalCase(str: string, firstLetterCaps: boolean = true): string {
  let replacement = str.replace(
    /-([a-zA-Z])/g,
    (g) => g[1].toUpperCase(),
  );
  if (firstLetterCaps) {
    replacement = replacement.replace(
      /^[a-z]/,
      (g) => g[0].toUpperCase(),
    );
  }
  return replacement;
}

export function toKebabCase(str: string): string {
  return str.replace(
      /([a-z][A-Z])/g,
      (g) => g[0] + "-" + g[1].toLowerCase(),
  ).toLowerCase();
}

export function toSnakeCase(str: string): string {
  return str.replace(
    /([a-z][A-Z])/g,
    (g) => g[0] + "_" + g[1].toLowerCase(),
  ).replace(/-/g,  "_").toLowerCase();
}

export function getJsonFilenameFromUrl(url: string): string | undefined {
  const match = url.match(/[\w-_]+\.json/);
  if (match) {
    return match[0];
  }
  return;
}

export function basename(fileName: string): string | undefined {
  const match = fileName.match(/^([\w-_]+)(\.[\w_]+)?/);
  if (match) {
    return match[1];
  }
  return;
}
