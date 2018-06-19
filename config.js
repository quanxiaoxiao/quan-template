const os = require('os');
const path = require('path');

const configDir = path.resolve(os.homedir(), 'templates');

module.exports = {
  configDir,
  configFilePath: path.join(configDir, 'config.js'),
};
