import path from 'path';

const defaultConfig = {
  component: {
    from: path.resolve(__dirname, '../', 'templates/component'),
    handle(a) {
      let filename = a.file.base;
      if (/^__\w+__$/.test(a.file.name)) {
        filename = `${a.name}${a.file.ext}`;
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
