const split2 = require('split2');
const os = require('os');
const fs = require('fs');
const chalk = require('chalk');
const through2 = require('through2');
const maxstache = require('./maxstache');

const { log } = console;

const transform = ({
  from,
  to,
  ctx,
}) =>
  new Promise((resolve, reject) => {
    const write = fs.createWriteStream(to);
    fs.createReadStream(from)
      .pipe(split2())
      .pipe(through2(function through(chunk, encode, next) {
        this.push(`${maxstache(String(chunk), ctx)}${os.EOL}`);
        next();
      }))
      .pipe(write);
    write.on('finish', () => {
      log(chalk.green(`file:${to} created`));
      resolve();
    });
    write.on('error', () => {
      reject();
    });
  });


module.exports = transform;
