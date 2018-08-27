#! /usr/bin/env node

// tslint:disable no-console
import * as program from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { sync } from 'globby';
import { dirname, join, relative, resolve } from 'path';

program
  .version('0.0.1')
  .option('-p, --project <file>', 'path to tsconfig.json');

program.on('--help', () => {
  console.log(`
  $ tscpath -p tsconfig.json
`);
});

program.parse(process.argv);

const { project } = program;
if (!project) {
  throw new Error('--project must be specified');
}

const configFile = join(process.cwd(), project);

const {
  compilerOptions: { baseUrl, outDir, paths },
  include,
}: {
  compilerOptions: {
    baseUrl: string;
    outDir: string;
    paths: { [key: string]: string[] };
  };
  include: string[];
  // tslint:disable-next-line no-var-requires
} = require(configFile);

/*
"baseUrl": ".",
"outDir": "lib",
"paths": {
  "src/*": ["src/*"]
},
*/

const configDir = dirname(configFile);
const basePath = join(configDir, baseUrl);
const toAbsPath = (x: string): string => join(basePath, x);
const outPath = toAbsPath(outDir);
const srcPaths = include
  .filter((x) => x.endsWith('/**/*'))
  .map((x) => toAbsPath(x.replace('/**/*', '')));
const srcRoot = srcPaths.length === 1 ? srcPaths[0] : basePath;
const outToSrc = (x: string): string => join(srcRoot, relative(outPath, x));

const aliases = Object.keys(paths).map((alias) => ({
  prefix: alias.replace(/\*$/, ''),
  aliasPaths: paths[alias as keyof typeof paths].map((p) =>
    join(basePath, p.replace(/\*$/, ''))
  ),
}));

const toRelative = (from: string, x: string): string => {
  const rel = relative(from, x);
  return rel.startsWith('.') ? rel : `./${rel}`;
};
const relToConfig = (x: string): string => toRelative(configDir, x);

console.log(`
tsconfig:
  base = ${relToConfig(basePath)}
  src = ${relToConfig(srcRoot)}
  sources = ${srcPaths.map((x) => relToConfig(x + '/**/*'))}
  out = ${relToConfig(outPath)}
  aliases = ${aliases.map(({ prefix }) => prefix).join(', ')}
`);

const exts = ['.js', '.jsx', '.ts', '.tsx', '.d.ts'];

const absToRel = (modulePath: string, outFile: string): string => {
  const alen = aliases.length;
  for (let j = 0; j < alen; j += 1) {
    const { prefix, aliasPaths } = aliases[j];

    if (modulePath.startsWith(prefix)) {
      const modulePathRel = modulePath.substring(prefix.length);
      const src = outToSrc(outFile);
      const outRel = relative(basePath, outFile);
      console.log(`${outRel} (source: ${relative(basePath, src)}):`);
      console.log(`\timport '${modulePath}'`);
      const len = aliasPaths.length;
      for (let i = 0; i < len; i += 1) {
        const apath = aliasPaths[i];
        const moduleSrc = join(apath, modulePathRel);
        if (
          existsSync(moduleSrc) ||
          exts.some((ext) => existsSync(moduleSrc + ext))
        ) {
          const rel = toRelative(dirname(src), moduleSrc);
          console.log(
            `\treplacing '${modulePath}' -> '${rel}' referencing ${relative(
              basePath,
              moduleSrc
            )}`
          );
          return rel;
        }
      }
      console.log(`\tcould not replace ${modulePath}`);
    }
  }
  return modulePath;
};

const requireRegex = /(?:import|require)\(['"]([^'"]*)['"]\)/g;
const importRegex = /from ['"]([^'"]*)['"]/g;

const replaceImportStatement = (
  orig: string,
  matched: string,
  outFile: string
): string => {
  const index = orig.indexOf(matched);
  return (
    orig.substring(0, index) +
    absToRel(matched, outFile) +
    orig.substring(index + matched.length)
  );
};

const replaceAlias = (text: string, outFile: string): string =>
  text
    .replace(requireRegex, (orig, matched) =>
      replaceImportStatement(orig, matched, outFile)
    )
    .replace(importRegex, (orig, matched) =>
      replaceImportStatement(orig, matched, outFile)
    );

// import relative to absolute path
const files = sync(`${outPath}/**/*.{js,jsx,ts,tsx}`, {
  dot: true,
  noDir: true,
} as any).map((x) => resolve(x));

const flen = files.length;
for (let i = 0; i < flen; i += 1) {
  const file = files[i];
  const text = readFileSync(file, 'utf8');
  const newText = replaceAlias(text, file);
  if (text !== newText) {
    writeFileSync(file, newText, 'utf8');
  }
}
