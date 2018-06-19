const yargs = require('yargs');
const { forkJoin } = require('rxjs');
const {
  flatMap,
  switchMap,
} = require('rxjs/operators');
const chalk = require('chalk');
const pkg = require('../package.json');
const {
  createFile$,
  toPromise,
  fileList$,
  updateFile$,
  options$,
  config$,
  match$,
  callback$,
  parseUrl$,
} = require('./observable');

yargs // eslint-disable-line
  .command({
    command: 'create <path>',
    desc: 'create some files from templates',
    handler: async (argv) => {
      const wait = {};
      try {
        await toPromise(options$(argv.path, wait)
          .pipe(
            switchMap(fileList$),
            flatMap(createFile$),
          ));
        wait.complete('create');
      } catch (error) {
        console.log(chalk.red(error));
      }
    },
  })
  .command({
    command: 'update <path>',
    desc: 'update some files from templates',
    handler: async (argv) => {
      try {
        const wait = {};
        await toPromise(options$(argv.path, wait)
          .pipe(
            switchMap(fileList$),
            flatMap(updateFile$),
          ));
        wait.complete('update');
      } catch (error) {
        console.log(chalk.red(error));
      }
    },
  })
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
      forkJoin(
        config$(),
        parseUrl$(argv.path),
      )
        .pipe(
          switchMap(([cfg, { query, pathname }]) => match$({ cfg, query, pathname })),
          switchMap(callback$),
        )
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
