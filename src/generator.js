import path from 'path';
import shelljs from 'shelljs';
import { convertContent, getAbsoultePath } from './utils';
import createFile from './createFile';
import getFileList from './getFileList';

export default function generator(name, flag, config) {
  const list = getFileList(config.from)
    .filter(filename => (config.filter ? config.filter({ filename, name, flag }) : true))
    .map(a => ({
      name,
      convert: convertContent,
      from: config.from,
      ...config.handle({
        name,
        flag,
        file: {
          ...path.parse(a),
          dir: config.dir || '',
        },
      }),
    }))
    .map(a => ({
      ...a,
      to: getAbsoultePath(a.to),
    }));

  for (let i = 0; i < list.length; i++) {
    const obj = list[i];
    if (shelljs.test('-d', obj.from)) {
      generator(name, flag, {
        ...config,
        from: obj.from,
        dir: path.basename(obj.from),
      });
    } else {
      createFile(obj);
    }
  }
}
