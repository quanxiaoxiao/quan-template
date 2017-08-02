import path from 'path';

export default {
  component: {
    from: path.resolve(__dirname, '../', 'templates/component'),
    filter({ filename, flag = 'component' }) {
      const flagList = flag.split('-');
      if (filename === '__Component__.js' && flagList.includes('clazz')) {
        return false;
      }
      if (filename === '__Clazz__.js' && !flagList.includes('clazz')) {
        return false;
      }
      if (filename === 'index.js' && flagList.includes('sub')) {
        return false;
      }
      return true;
    },
    handle({ file, name, flag = 'component' }) {
      let filename = file.base;
      const flagList = flag.split('-');
      const subIndex = flagList.indexOf('sub');
      if (/^__\w+__$/.test(file.name)) {
        filename = `${name}${file.ext}`;
      }
      return {
        from: path.resolve(this.from, file.base),
        to: path.join(
          'temp/components',
          subIndex !== -1 ? flagList[subIndex + 1] : name,
          filename,
        ),
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
        from: path.resolve(this.from, a.file.base),
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

  dir: {
    from: path.resolve(__dirname, '../', 'src'),
    filter({ filename }) {
      if (filename === 'node_modules') {
        return false;
      }
      return true;
    },
    handle(a) {
      return {
        from: path.resolve(this.from, a.file.base),
        to: path.join(a.name, a.file.dir, a.file.base),
      };
    },
  },
};
