const fs = require('fs');
const shelljs = require('shelljs');
const path = require('path');
const chalk = require('chalk');
const maxstache = require('./utils/maxstache-stream');

const { log } = console;

function createFileFromTemplate({
  from,
  to,
  ctx,
  name,
  flag,
}) {
  const sourceBasename = path.basename(from);
  try {
    fs.accessSync(to);
  } catch (e) {
    shelljs.mkdir('-p', to);
  }
  let fileName = sourceBasename;
  if (/^__(.+)__(\.\w+)?$/.test(sourceBasename)) {
    if (RegExp.$1 !== flag) {
      return Promise.resolve();
    }
    fileName = `${name}${RegExp.$2 || ''}`;
  }
  const dest = path.resolve(to, fileName);
  if (shelljs.test('-f', dest)) {
    log(chalk.red(`file:${dest} already exist!`));
    return Promise.resolve();
  }
  return maxstache({
    from,
    to: dest,
    ctx,
  });
}

function makeFiles({
  from,
  to,
  level = 0,
  ...other
}) {
  const stat = fs.statSync(from);
  if (stat.isFile()) {
    return createFileFromTemplate({
      ...other,
      from,
      to,
    });
  }
  const files = fs.readdirSync(from);
  level++; // eslint-disable-line no-param-reassign
  const dir = path.basename(from);
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const a = makeFiles({
      ...other,
      from: path.resolve(from, file),
      to: level <= 1 ? to : path.resolve(to, dir),
      level,
    });
    promises.push(a);
  }
  return Promise.all(promises);
}

module.exports = makeFiles;
