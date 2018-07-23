const path = require('path');
const { Module } = require('module');
const pathToRegexp = require('path-to-regexp');
const qs = require('querystring');
const _ = require('lodash');
const shelljs = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const {
  of,
  bindNodeCallback,
  throwError,
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
const { configDir, configFilePath } = require('../config');

const noop = a => a;

const parseUrl$ = str => of(url.parse(str))
  .pipe(map(({ pathname, query }) => ({
    pathname,
    query: qs.parse(query),
  })));

const config$ = () => bindNodeCallback(fs.readFile)(configFilePath, 'utf-8')
  .pipe(map((script) => {
    const mod = new Module(configFilePath, module);
    mod.__filename = configFilePath;
    mod.__dirname = configDir;
    mod.paths = Module._nodeModulePaths(configDir);
    mod._compile(script, configFilePath);
    return mod.exports;
  }));

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

const select$ = str =>
  forkJoin(
    parseUrl$(str),
    config$(),
  )
    .pipe(
      switchMap(([{ pathname, query }, cfg]) => match$({ pathname, query, cfg })),
      map(({ handler, ...other }) => handler(other)),
      map(options => ({
        ...(options && options.from != null) ? {
          to: path.resolve(process.cwd(), options.to || ''),
          from: path.resolve(configDir, options.from),
          include: options.include || [],
          exclude: [/\.swp$/, ...(options.exclude || [])],
          handlePathName: options.handlePathName || noop,
          handleContent: options.handleContent || noop,
          next: options.next || function next() {},
        } : {
          next: options ? (options.next || function next() {}) : () => {},
        },
      })),
    );

const fileList$ = options => from(getFileList(options.from))
  .pipe(
    map(source => ({
      source,
      basename: options.from.length === source.length ?
        path.basename(source) :
        source.substring(options.from.length).replace(/^\//, ''),
    })),
    filter(({ basename }) => {
      if ([/\.swp$/, ...options.exclude].some(a => a.test(basename))) {
        return false;
      }
      if (_.isEmpty(options.include)) {
        return true;
      }
      return options.include.some(a => a.test(basename));
    }),
    map(({ source, basename }) => ({
      source,
      destination: path.resolve(process.cwd(), options.to, options.handlePathName(basename)),
      handleContent: options.handleContent,
    })),
  );

module.exports = {
  updateFile$,
  select$,
  parseUrl$,
  config$,
  match$,
  createFile$,
  fileList$,
};
