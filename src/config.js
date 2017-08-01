import path from 'path';

const defaultConfig = {
  component: {
    from: path.resolve(__dirname, '../', 'templates/component'),
    handle(a) {
      let filename = a.file.base;
      const flagList = (a.flag || 'component').split('-');
      if (filename === '__Component__.js' && flagList.includes('clazz')) {
        return null;
      }
      if (filename === '__Clazz__.js' && !flagList.includes('clazz')) {
        return null;
      }
      if (filename === 'index.js' && flagList.includes('sub')) {
        return null;
      }
      const subIndex = flagList.indexOf('sub');
      if (/^__\w+__$/.test(a.file.name)) {
        filename = `${a.name}${a.file.ext}`;
      }
      if (subIndex !== -1) {
        return {
          to: path.join('temp/components', flagList[subIndex + 1], filename),
        };
      }
      return {
        to: path.join('temp/components', a.name, filename),
      };
    },
  },

  container: {
    from: path.resolve(__dirname, '../', 'templates/container'),
    handle(a) {
      let filename = a.file.base;
      if (a.file.base === 'Component.js') {
        filename = `${a.name}.js`;
      }
      return {
        to: path.join('temp/containers', a.name, filename),
      };
    },
  },

  reducer: {
    from: path.resolve(__dirname, '../', 'templates/redux/reducer.js'),
    handle(a) {
      let filename = a.file.base;
      if (a.file.base === 'reducer.js') {
        filename = `${a.name}.js`;
      }
      return {
        to: path.join('temp/reducers', filename),
      };
    },
  },
};

export default defaultConfig;
