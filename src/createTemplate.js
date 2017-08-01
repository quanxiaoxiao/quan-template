import path from 'path';
import fs from 'fs';
import shelljs from 'shelljs';
import chalk from 'chalk';

const log = console.log;

function createTemplate({ to, from, name, convert }) {
  const dir = path.dirname(to);
  if (!shelljs.test('-d', dir)) {
    shelljs.mkdir('-p', dir);
  }
  try {
    fs.accessSync(to);
    log(`file: ${chalk.red(to)} already exist`);
  } catch (e) {
    const content = fs.readFileSync(from, 'utf-8');
    fs.writeFileSync(to, convert(content, name), 'utf8');
    log(`file: ${chalk.green(to)} created`);
  }
}

export default createTemplate;
