const path = require('path');
const { Module } = require('module');
const pathToRegexp = require('path-to-regexp');
const qs = require('querystring');
const _ = require('lodash');
const shelljs = require('shelljs');
const os = require('os');
const fs = require('fs');
const chalk = require('chalk');
const {
  of,
  bindNodeCallback,
  throwError,
  bindCallback,
  iif,
  forkJoin,
  from,
} = require('rxjs');
const {
  map,
  switchMap,
  tap,
  catchError,
  filter,
} = require('rxjs/operators');
const url = require('url');
const { getFileList } = require('./utils');

const configDir = path.resolve(os.homedir(), 'templates');
const configPath = path.join(configDir, 'config.js');
const noop = a => a;

const parseUrl$ = str => of(url.parse(str))
  .pipe(map(({ pathname, query }) => ({
    pathname,
    query: qs.parse(query),
  })));

const config$ = () => bindNodeCallback(fs.readFile)(configPath, 'utf-8')
  .pipe(map((script) => {
    const mod = new Module(configPath, module);
    mod.__filename = configPath;
    mod.__dirname = configDir;
    mod.paths = Module._nodeModulePaths(configDir);
    mod._compile(script, configPath);
    return mod.exports;
  }));

const callback$ = ({ handler, ...other }) => bindCallback(handler)(other);

const match$ = ({ pathname, query, cfg }) =>
  of(Object.keys(cfg).find(key => pathToRegexp(key).test(pathname)))
    .pipe(
      switchMap(routePath => iif(
        () => routePath != null,
        of(routePath),
        throwError(`path: ${pathname}, no match`),
      )),
      map((routePath) => {
        const paramNames = [];
        const [, ...captures] = pathname.match(pathToRegexp(routePath, paramNames));
        const params = paramNames.reduce((acc, cur, i) => ({
          ...acc,
          [cur.name]: captures[i],
        }), {});
        return {
          handler: cfg[routePath],
          params,
          query,
        };
      }),
    );

const rawFileList = ['.jpg', '.png', '.jpeg', '.ico'];

const createFile$ = ({ source, destination, handleContent }) =>
  iif(
    () => shelljs.test('-f', destination),
    throwError(`file:${destination} already exist!`),
    bindNodeCallback(fs.readFile)(source)
      .pipe(
        tap(() => {
          if (!shelljs.test('-d', path.dirname(destination))) {
            shelljs.mkdir('-p', path.dirname(destination));
          }
        }),
        map(buf => (rawFileList.includes(path.extname(source)) ? buf : handleContent(buf.toString('utf-8')))),
        switchMap(buf => bindNodeCallback(fs.writeFile)(destination, buf)),
        tap(() => {
          console.log(chalk.green(`file:${destination} created`));
        }),
      ),
  ).pipe(
    catchError((error) => {
      console.log(chalk.red(error));
      return of(destination);
    }),
    map(() => destination),
  );

const updateFile$ = ({ source, destination, handleContent }) =>
  bindNodeCallback(fs.readFile)(source)
    .pipe(
      map(buf => (rawFileList.includes(path.extname(source)) ? buf : handleContent(buf.toString('utf-8')))),
      tap(() => {
        if (!shelljs.test('-d', path.dirname(destination))) {
          shelljs.mkdir('-p', path.dirname(destination));
        }
      }),
      switchMap((buf) => {
        if (!shelljs.test('-f', destination)) {
          return bindNodeCallback(fs.writeFile)(destination, buf)
            .pipe(tap(() => {
              console.log(chalk.green(`file:${destination} created`));
            }));
        }
        return bindNodeCallback(fs.writeFile)(destination, buf)
          .pipe(tap(() => {
            console.log(chalk.green(`file:${destination} updated`));
          }));
      }),
      map(() => destination),
    );

const options$ = (str, wait = {}) =>
  forkJoin(
    parseUrl$(str),
    config$(),
  ).pipe(
    switchMap(([{ pathname, query }, cfg]) => match$({ pathname, query, cfg })),
    switchMap(callback$),
    tap(({ complete = () => {} }) => {
      wait.complete = complete; // eslint-disable-line
    }),
    map(({
      to,
      from: _from,
      include,
      exclude = [],
      handlePathName = noop,
      handleContent = noop,
    }) => ({
      to: path.resolve(process.cwd(), to),
      from: path.resolve(configDir, _from),
      include,
      exclude: [/\.swp$/, ...exclude],
      handlePathName,
      handleContent,
    })),
  );

const fileList$ = ({
  to,
  from: _from,
  include,
  exclude,
  handlePathName,
  handleContent,
}) => from(getFileList(_from))
  .pipe(
    map(source => ({
      source,
      basename: _from.length === source.length ?
        path.basename(source) :
        source.substring(_from.length).replace(/^\//, ''),
    })),
    filter(({ basename }) => {
      if ([/\.swp$/, ...exclude].some(a => a.test(basename))) {
        return false;
      }
      if (_.isEmpty(include)) {
        return true;
      }
      return include.some(a => a.test(basename));
    }),
    map(({ source, basename }) => ({
      source,
      destination: path.resolve(process.cwd(), to, handlePathName(basename)),
      handleContent,
    })),
  );

const toPromise = observe => new Promise((resolve, reject) => {
  const store = [];
  observe.subscribe({
    next: (data) => {
      store.push(data);
    },
    complete: () => {
      resolve(store);
    },
    error: (error) => {
      reject(error);
    },
  });
});

module.exports = {
  updateFile$,
  parseUrl$,
  config$,
  options$,
  match$,
  callback$,
  createFile$,
  fileList$,
  toPromise,
};
