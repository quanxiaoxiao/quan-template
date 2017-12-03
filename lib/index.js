const paht = require('path');
const { getRealPathFromPlaceholderPath, getRouteAndPlaceholder } = require('./utils');
const makeFiles = require('./makeFiles');


const ctx = ({ name }) => ({ name });

const create = ({ name = '', flag, config }) => {
  const {
    flag: _flag,
    route,
    placelolder,
  } = getRouteAndPlaceholder({ name, flag });
  const to = config[route] || '';
  makeFiles({
    name,
    flag: _flag || config.flag,
    from: config.from,
    to: paht.resolve(process.cwd(), getRealPathFromPlaceholderPath(to, placelolder)),
    ctx: (config.ctx || ctx)({ name, flag: _flag || config.flag }),
  })
    .then(() => {
      if (config.post) {
        config.post({ name, flag });
      }
    });
};

module.exports = create;
