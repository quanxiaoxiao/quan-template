import _ from 'lodash';
import _config from '../config';

import generator from '../generator';

export default (argv) => {
  const name = _.first(argv._);
  if (name === 'ls') {
    console.log(Object.keys(_config).join('\n'));
    return;
  }
  const config = _config[argv.type];
  const flag = argv.flag;
  if (!_.isPlainObject(config)) {
    throw new TypeError();
  }


  generator(name, flag, config);
  if (typeof config.post === 'function') {
    config.post(name, flag);
  }
};
