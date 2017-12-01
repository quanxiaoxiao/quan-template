const os = require('os');
const path = require('path');
const fs = require('fs');
const shelljs = require('shelljs');
const { mergeConfig } = require('./utils');

const dir = path.resolve(os.homedir(), '.template');

let config;

const init = () => {
  if (!shelljs.test('-d', dir)) {
    shelljs.mkdir(dir);
    fs.writeFileSync(path.resolve(dir, 'config.js'), 'module.exports = {};');
  }
  config = require(path.resolve(dir, 'config.js')); // eslint-disable-line
  try {
    const self = require(path.resolve(process.cwd(), 'template.config.js')); // eslint-disable-line
    config = mergeConfig(config, self);
  } catch (e) {
    // ignore
  }
};

const get = () => config;


module.exports = {
  init,
  get,
};
