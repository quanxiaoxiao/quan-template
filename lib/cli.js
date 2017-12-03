const _ = require('lodash');
const yargs = require('yargs');
const chalk = require('chalk');
const pkg = require('../package.json');
const create = require('./index');
const config = require('./config');

config.init();
const { log } = console;

const { argv } = yargs
  .options({
    type: {
      alias: 't',
      description: 'template type',
      default: 'default',
    },
    flag: {
      alias: 'f',
    },
  })
  .options({
    list: {
      alias: 'l',
      description: 'list types',
    },
  })
  .version(pkg.version).alias('version', 'v');

if (argv.list) {
  const info = Object.keys(config.get())
    .map((key) => {
      const a = `  --type: ${key}, --flag: ${config.get()[key].flag || ''}`;
      return a;
    }).join('\n');
  log(info);
} else {
  const { type } = argv;
  if (!config.get()[type]) {
    log(chalk.red(`type: ${type}, can't find`));
  } else {
    create({
      name: _.first(argv._),
      flag: argv.flag,
      config: config.get()[type],
    });
  }
}
