const chalk = require('chalk');
const paht = require('path');
const { getRealPathFromPlaceholderPath, getRouteAndPlaceholder } = require('./utils');
const config = require('./config');
const makeFiles = require('./makeFiles');

config.init();

const { log } = console;

const ctx = ({ name }) => ({ name });

const create = ({ name = '', flag, type }) => {
  if (name === 'ls') {
    const info = Object.keys(config.get())
      .map((key) => {
        const a = `  --type: ${key}, --flag: ${config.get()[key].flag || ''}`;
        return a;
      }).join('\n');
    log(chalk.green(info));
    return;
  }
  const _config = config.get()[type];
  if (!_config) {
    log(chalk.red(`type: ${type}, can't find`));
    return;
  }
  const {
    flag: _flag,
    route,
    placelolder,
  } = getRouteAndPlaceholder({ name, flag });
  const to = _config[route];
  if (!to) {
    log(chalk.red(`path: ${route}, can't match any dest path`));
    return;
  }
  makeFiles({
    name,
    flag: _flag || _config.flag,
    from: _config.from,
    to: paht.resolve(process.cwd(), getRealPathFromPlaceholderPath(to, placelolder)),
    ctx: (_config.ctx || ctx)({ name, flag: _flag || _config.flag }),
  })
    .then(() => {
      if (_config.post) {
        _config.post({ name, flag });
      }
    });
};

module.exports = create;
