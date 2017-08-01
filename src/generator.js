import _ from 'lodash';
import path from 'path';
import shelljs from 'shelljs';
import { convertContent, getAbsoultePath } from './utils';
import createFile from './createFile';

export default function generator(name, flag, fileList, config) {
  const list = fileList
    .filter(config.filter || _.identity)
    .map((a) => {
      const result = config.handle({ name, flag, file: path.parse(a) });
      if (!result) {
        return null;
      }
      return {
        name,
        convert: convertContent,
        from: config.from,
        ...result,
      };
    })
    .filter(a => a)
    .map(a => ({
      ...a,
      to: getAbsoultePath(a.to),
    }));

  // .forEach(createFile);

  for (let i = 0; i < list.length; i++) {
    const obj = list[i];
    if (shelljs.test('-d', obj.from)) {
      // ignore
    } else {
      createFile(obj);
    }
  }
}
