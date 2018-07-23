const yargs = require('yargs');
const {
  of,
  concat,
  iif,
} = require('rxjs');
const {
  flatMap,
  switchMap,
  last,
  tap,
} = require('rxjs/operators');
const chalk = require('chalk');
const pkg = require('../package.json');
const {
  createFile$,
  fileList$,
  updateFile$,
  config$,
  select$,
} = require('./observable');

yargs // eslint-disable-line
  .command(
    'get <path>',
    'create some files from templates',
    () => yargs.options({
      header: {
        alias: 'H',
      },
      cover: {
        alias: 'c',
        default: 'false',
      },
      data: {
        alias: 'd',
      },
    }),
    (argv) => {
      select$(argv.path)
        .pipe(
          switchMap(({ next, ...options }) =>
            concat(fileList$(options)
              .pipe(flatMap(des => iif(
                () => argv.cover === 'true',
                updateFile$(des),
                createFile$(des),
              ))), of(next))),
          last(),
          tap(next => next()),
        )
        .subscribe({
          error: (error) => {
            console.log(chalk.red(error));
          },
        });
    },
  )
  .command({
    command: 'ls',
    desc: 'list path',
    handler: () => {
      config$()
        .subscribe((ctx) => {
          console.log(chalk.green(Object.keys(ctx).join('\n')));
        });
    },
  })
  .command({
    command: 'info <path>',
    desc: 'show info with path',
    handler: (argv) => {
      select$(argv.path)
        .subscribe(
          (result) => {
            console.log(result);
          },
          (error) => {
            console.log(chalk.red(error));
          },
        );
    },
  })
  .version(pkg.version)
  .alias('version', 'v')
  .argv;
