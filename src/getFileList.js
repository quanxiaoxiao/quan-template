import fs from 'fs';
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
  const stats = fs.statSync(from);
  if (stats.isDirectory()) {
    return fs.readdirSync(from);
  }
  return [from];
}
