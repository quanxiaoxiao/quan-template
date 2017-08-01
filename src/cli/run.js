import _ from 'lodash';
import path from 'path';
import _config from '../config';

import createTemplate from '../createTemplate';
import { convertContent, getAbsoultePath } from '../utils';
import getFileList from '../getFileList';

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

  const { from } = config;
  const fileList = getFileList(from);
  fileList
    .filter(config.filter || _.identity)
    .map((a) => {
      const result = config.handle({ name, flag, file: path.parse(a) });
      if (!result) {
        return null;
      }
      return {
        name,
        convert: convertContent,
        ...(/\.\w+$/.test(config.from) ?
        {
          from: config.from,
        } :
        {
          from: path.resolve(config.from, path.basename(a)),
        }),
        ...result,
      };
    })
    .filter(a => a)
    .map(a => ({
      ...a,
      to: getAbsoultePath(a.to),
    }))
    .forEach(createTemplate);
};
