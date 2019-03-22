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
  "build": "tsc --project tsconfig.json && tscpaths -p tsconfig.json -s ./src -o ./out",
}
```

### Options
| flag         | description                                        |
| ------------ | -------------------------------------------------- |
| -p --project | project configuration file (tsconfig.json)         |
| -s --src     | source code root directory                         |
| -o --out     | output directory of transpiled code (tsc --outDir) |

You need to provide -s (--src) and -o (--out), because it's hard to predict source and output paths based on tsconfig.json.

I've tried a little and failed. :(

`tsc` does some magic to determine source and output paths and I haven't dived too deep to mimic it.

For now, it's simpler to provide the paths manually.

If you know how, Pull Requests are welcome!


# Disclaimer !!!!!
This is not a mature project yet.

It works for my setup so far.

It may not work correctly if your setup is too complicated, so please do some testing before pushing it to production!!!
