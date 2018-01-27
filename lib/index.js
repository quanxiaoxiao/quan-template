const paht = require('path');
const _ = require('lodash');
const shelljs = require('shelljs');
const chalk = require('chalk');
const { getRealPathFromPlaceholderPath, getRouteAndPlaceholder } = require('./utils');
const makeFiles = require('./makeFiles');


const ctx = ({ name }) => ({ name });

const create = ({ name = '', flag, config }) => {
  const {
    flag: _flag,
    route,
    placelolder,
  } = getRouteAndPlaceholder({ name, flag });
  const router = config[route];
  let { from } = config;
  let to = router;
  if (_.isPlainObject(router)) {
    from = router.from; // eslint-disable-line
    to = router.to; // eslint-disable-line
  }

  if (from == null) {
    console.log(chalk.red('`from` is not include'));
    return;
  }

  if (to == null) {
    to = '';
  }

  if (from.match(/\.git$/)) {
    shelljs.exec(`git clone ${from} ${name}`, (code) => {
      if (code === 0 && config.post) {
        config.post({ name, flag });
      }
    });
  } else {
    makeFiles({
      name,
      flag: _flag || config.flag,
      from,
      to: paht.resolve(process.cwd(), getRealPathFromPlaceholderPath(to, placelolder)),
      ctx: (config.ctx || ctx)({ name, flag: _flag || config.flag }),
    })
      .then(() => {
        if (config.post) {
          config.post({ name, flag });
        }
      });
  }
};

module.exports = create;
