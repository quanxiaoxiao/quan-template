import fs from 'fs';
import shelljs from 'shelljs';
import { getAbsoultePath } from './utils';

export default function getFileList(from) {
  if (typeof from !== 'string' || Array.isArray(from)) {
    throw new Error();
  }
  if (Array.isArray(from)) {
    return from
      .map(getAbsoultePath);
  }
  from = getAbsoultePath(from); // eslint-disable-line
  if (shelljs.test('-d', from)) {
    return fs.readdirSync(from);
  }
  return [from];
}
