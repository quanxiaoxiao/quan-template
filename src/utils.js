import path from 'path';

export const convertContent = (content, name) => content.replace(/{{\s*name\s*}}/g, name);

export const getAbsoultePath = (src) => {
  if (path.isAbsolute(src)) {
    return src;
  }
  return path.resolve(process.cwd(), src);
};
