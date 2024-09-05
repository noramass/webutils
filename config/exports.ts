export type NodeModulePath = "." | `./${string}`;

export interface PackageJsonLegacyExportFields {
  main?: NodeModulePath;
  module?: NodeModulePath;
  types?: NodeModulePath;
  browser?: NodeModulePath;
  entry?: NodeModulePath;
}

export interface PackageJsonExportFields extends PackageJsonLegacyExportFields {
  exports?: NodeModulePath | NodeExports | NodeConditionalExports;
  type?: "module";
}

export type NodeExports = Partial<Record<NodeModulePath, NodeModulePath | NodeConditionalExports | null>>;

export interface NodeExportDefaultConditions {
  import: false;
  require: false;
  node: true;
  "node-addons": true;
  default: false;
}

export interface NodeExportCommunityConditions {
  types: false;
  browser: true;
  development: true;
  production: true;
  entry: false;
}

export type TsupConditionTags = keyof {
  [Key in keyof NodeExportConditions]: NodeExportConditions[Key] extends false ? never : Key;
};

export interface NodeExportConditions extends NodeExportDefaultConditions, NodeExportCommunityConditions {}

export type NodeConditionalExports = {
  [Key in keyof NodeExportConditions]?: NodeExportConditions[Key] extends true
    ? NodeConditionalExports | NodeModulePath
    : NodeModulePath;
};

interface NormalizedExportOptions {
  entry: NodeModulePath;
  import?: NodeModulePath;
  require?: NodeModulePath;
  types?: NodeModulePath;
  targets: Exclude<keyof NodeExportConditions, "types" | "entry" | "import" | "require">[];
}

export function normaliseModuleExports(pkg: PackageJsonExportFields): NormalizedExportOptions[] {
  if (isLegacy(pkg)) return normaliseLegacyExports(pkg);
  if (typeof pkg.exports === "string") return normaliseSinglePathExport(pkg.exports, pkg.type);
  if (!pkg.exports) throw Error(`Can't determine exports for package "${(pkg as { name: string }).name}".`);
  return normaliseModernExports(pkg.exports, [], pkg);
}

function isLegacy(pkg: PackageJsonExportFields): pkg is { exports: undefined } & PackageJsonLegacyExportFields {
  return !("exports" in pkg);
}

function isConditionalExport(exports: NodeConditionalExports | NodeExports): exports is NodeConditionalExports {
  return Object.keys(exports).some(it => !it.startsWith("./") || it !== ".");
}

function isDirectConditionalExport(exports: NodeConditionalExports) {
  return Object.keys(exports).some(key => ["types", "import", "require", "entry"].includes(key));
}

function normaliseModernExports(
  exports: NodeExports | NodeConditionalExports | NodeModulePath,
  tags: NormalizedExportOptions["targets"],
  pkg: PackageJsonExportFields,
): NormalizedExportOptions[] {
  if (typeof exports === "string")
    return [
      {
        entry: entryPath(exports),
        [nodePathExportType(exports, pkg)]: exports,
        types: typesPath(exports),
        targets: tags,
      },
    ];
  if (isConditionalExport(exports)) return normaliseConditionalExports(exports, tags, pkg);
  return Object.values(exports)
    .filter(it => it)
    .flatMap(exports => normaliseModernExports(exports!, tags, pkg));
}

function normaliseConditionalExports(
  exports: NodeConditionalExports,
  tags: NormalizedExportOptions["targets"],
  pkg: PackageJsonExportFields,
): NormalizedExportOptions[] {
  if (isDirectConditionalExport(exports)) {
    const defaultPath = exports.require ?? exports.import ?? exports.types!;
    return [
      {
        entry: exports.entry ?? entryPath(defaultPath),
        require: exports.require,
        import: exports.import,
        types: exports.types ?? typesPath(defaultPath),
        targets: tags,
      },
    ];
  } else
    return Object.entries(exports).flatMap(([key, exports]) => {
      if (typeof exports === "string")
        return [
          {
            entry: entryPath(exports),
            [nodePathExportType(exports, pkg)]: exports,
            types: typesPath(exports),
            targets: [...tags, key as never],
          },
        ];
      else return normaliseConditionalExports(exports, [...tags, key as never], pkg);
    });
}

function nodePathExportType(path: NodeModulePath, pkg: PackageJsonExportFields): "require" | "import" {
  if (/\.(cjsx?|cjs\.jsx?)/.test(path)) return "require";
  if (/\.(mjsx?|esm\.jsx?|mjs\.jsx?)/.test(path)) return "import";
  return pkg.type === "module" ? "import" : "require";
}

function normaliseLegacyExports(pkg: PackageJsonLegacyExportFields): NormalizedExportOptions[] {
  const defaultPath = pkg.main ?? pkg.module;
  if (!defaultPath) throw new Error("At least one of 'exports', 'main' or 'module' are required in package.json file.");

  const defaultConfig: NormalizedExportOptions = {
    entry: pkg.entry ?? entryPath(defaultPath),
    import: pkg.module,
    require: pkg.main,
    types: pkg.types ?? typesPath(defaultPath),
    targets: ["default"],
  };

  return pkg.browser
    ? [
        defaultConfig,
        {
          entry: pkg.entry ?? entryPath(pkg.browser),
          require: pkg.browser,
          types: pkg.types ?? typesPath(pkg.browser),
          targets: ["browser"],
        },
      ]
    : [defaultConfig];
}

function normaliseSinglePathExport(path: NodeModulePath, type?: string): NormalizedExportOptions[] {
  return [
    {
      entry: entryPath(path),
      [type === "module" ? "import" : "require"]: path,
      types: typesPath(path),
      targets: ["default"],
    },
  ];
}

function replaceExtension(path: NodeModulePath, extension: string): NodeModulePath {
  return path.replace(/\.([cm]?jsx?|d\.ts)$/, extension) as NodeModulePath;
}

function typesPath(path: NodeModulePath): NodeModulePath {
  return path.replace(/\.[cm]?jsx?$/, ".d.ts") as NodeModulePath;
}

function entryPath(path: NodeModulePath): NodeModulePath {
  return replaceExtension(path.replace(/\/dist\//, "/src/") as NodeModulePath, ".ts");
}
