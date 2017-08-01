import yargs from 'yargs';
import pkg from '../../package.json';
import run from './run';

const argv = yargs
  .options({
    type: {
      alias: 't',
      description: 'Set template type',
      default: 'component',
    },
  })
  .version(pkg.version).alias('version', 'v')
  .argv;

run(argv);
