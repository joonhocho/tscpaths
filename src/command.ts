// tslint:disable no-console
import * as program from 'commander';
import { IOptions, resolvePaths } from './resolve-paths';

export function command(): void {
  program
    .version('0.0.1')
    .option('-p, --project <file>', 'path to tsconfig.json')
    .option('-s, --src <path>', 'source root path')
    .option('-o, --out <path>', 'output root path');

  program.on('--help', () => {
    console.log(`
  $ tscpath -p tsconfig.json
`);
  });

  program.parse(process.argv);

  resolvePaths(program as IOptions);
}
