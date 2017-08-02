import _ from 'lodash';
import _config from '../config';

import generator from '../generator';

export default (argv) => {
  const name = _.first(argv._);
  if (_.isUndefined(name)) {
    throw new Error('lack name');
  }
  const config = _config[argv.type];
  const flag = argv.flag;
  if (!_.isPlainObject(config)) {
    throw new TypeError();
  }

  generator(name, flag, config);
  if (typeof config.post === 'function') {
    config.post();
  }
};
