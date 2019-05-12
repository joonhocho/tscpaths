# tscpaths
Replace absolute paths to relative paths after typescript compilation (tsc) during compile-time.

[![npm version](https://badge.fury.io/js/tscpaths.svg)](https://badge.fury.io/js/tscpaths)
[![Dependency Status](https://david-dm.org/joonhocho/tscpaths.svg)](https://david-dm.org/joonhocho/tscpaths)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

## Comparison to [tsconfig-paths](https://github.com/dividab/tsconfig-paths)
\+ Compile time (no runtime dependencies)

## Getting Started
First, install tscpaths as devDependency using npm or yarn.

```sh
npm install --save-dev tscpaths
# or
yarn add -D tscpaths
```

## Add it to your build scripts in package.json
```json
"scripts": {
  "build": "tsc --project tsconfig.json && tscpaths --project tsconfig.json",
}
```

## Building only the types
You can also setup a seperate tsconfig file just for types like `tsconfig.types.json` if you are also compiling with Babel.
```json
// tsconfig.types.json
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "module": "amd",
    "outDir": "dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": false,
    "isolatedModules": false,
    "noEmit": false,
    "allowJs": false,
    "emitDeclarationOnly": true
  },
  "exclude": ["**/*.test.ts"]
}
```
And then target that
```json
"scripts": {
  "build:types": "tsc --project tsconfig.types.json && tscpaths -project tsconfig.types.json",
}
```

Your final build script might look like
```json
"scripts": {
  "build": "yarn build:commonjs && yarn build:types",
}
```

## Options
| flag         | description                                                                          |
| ------------ | ------------------------------------------------------------------------------------ |
| -p --project | project configuration file (tsconfig.json)                                           |
| -s --src     | source code root directory (overrides the tsconfig provided)                         |
| -o --out     | output directory of transpiled code (tsc --outDir) (overrides the tsconfig provided) |
| -v --verbose | console.log all the events                                                           |

# Disclaimer
This is not a mature project yet. Pull Requests are welcome!

It works for my setup so far.

It may not work correctly if your setup is too complicated, so please do some testing before pushing it to production!!!


# Changelog

>  You need to provide -s (--src) and -o (--out), because it's hard to predict source and output paths based on tsconfig.json.
>  
>  I've tried a little and failed. :(

The above is no longer neccesary <-- got you fam: @jonkwheeler
