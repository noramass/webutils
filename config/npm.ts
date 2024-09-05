interface ExportDef {
  node: string;
  import: string;
  require: string;
  types: string;
  entry?: string;
}

interface PackageMeta {
  name: string;
  description: string;
  version: string;
  author: string;
  license: string;
  since: number;
  optionalDependencies?: Record<string, string>;
}

interface PackageLegacyExportFields {
  main: string;
  module: string;
  types: string;
  entry?: string;
}

interface PackageExportFields {
  exports?: ExportDef | ExportDef[] | Record<string, Omit<ExportDef, "node">>;
}

export type PackageJson = PackageMeta &
  (PackageLegacyExportFields | PackageExportFields) &
  Partial<PackageExportFields & PackageLegacyExportFields>;

export function packageExports(pkg: PackageJson): ExportDef[] {
  if (typeof pkg.exports !== "object")
    return [
      {
        node: "./",
        import: pkg.module!,
        require: pkg.main!,
        types: pkg.types!,
        entry: pkg.entry,
      },
    ];

  if (Array.isArray(pkg.exports)) return pkg.exports;
  if ("node" in pkg.exports) return [pkg.exports as ExportDef];

  return Object.entries(pkg.exports).map(([node, otherFields]) => ({ node, ...otherFields }));
}

export function packageEntryPoints(pkg: PackageJson): [target: string, entry: string][] {
  return packageExports(pkg).map(exports => {
    const target = exports.types.replace(".d.ts", "");
    const entry = exports.entry ?? target.replace("./dist", "./src") + ".ts";
    return [target.replace("./dist/", ""), entry];
  });
}

export function packageBanner(pkg: PackageMeta): string {
  const lines = [pkg.name, pkg.description, `© ${dateRange(pkg.since)} ${pkg.author}`, `@license ${pkg.license}`]
    .filter(it => it)
    .map(String);
  return `/**!${lines.map(line => `\n * ${line}`).join("")}\n */`;
}

function dateRange(since: number) {
  const now = new Date().getFullYear();
  if (now === since) return `${since}`;
  return `${since} - ${now}`;
}
