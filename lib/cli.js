const _ = require('lodash');
const yargs = require('yargs');
const pkg = require('../package.json');
const create = require('./index');

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
  .version(pkg.version).alias('version', 'v');

create({
  name: _.first(argv._),
  flag: argv.flag,
  type: argv.type,
});
