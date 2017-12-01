const getRealPathFromPlaceholderPath = (path, name) =>
  path.replace(/(\/_\/)|(\/_$)|(^_\/)|(^_$)/g, a => a.replace(/_/, name));

const getRouteAndPlaceholder = ({ name, flag }) => {
  let route = 'to';
  let placelolder = name;
  if (!flag) {
    return {
      route,
      placelolder,
      flag: '',
    };
  }
  if (/^(\/[^/]*)/.test(flag)) {
    route = RegExp.$1;
    flag = flag.slice(RegExp.$1.length + 1); // eslint-disable-line no-param-reassign
  }
  const matches = flag.match(/(?:(.+)\/)?([^/]+)$/);
  if (!matches) {
    return {
      route,
      placelolder: flag ? flag.replace(/\/$/, '') : name,
      flag: '',
    };
  }
  const [, a, b = ''] = matches;
  if (a) {
    placelolder = a;
  }

  return {
    route,
    placelolder,
    flag: b,
  };
};

const mergeConfig = (origin, custom) =>
  Object.keys(custom).reduce((acc, key) => {
    const item = custom[key];
    const { extend, ...other } = item;
    if (extend && origin[extend]) {
      return {
        ...acc,
        [key]: {
          ...origin[extend],
          ...other,
        },
      };
    }
    return {
      ...acc,
      [key]: other,
    };
  }, origin);

module.exports = {
  getRealPathFromPlaceholderPath,
  getRouteAndPlaceholder,
  mergeConfig,
};
