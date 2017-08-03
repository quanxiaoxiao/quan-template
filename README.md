# quan-template

## Install
```bash
npm install -g quan-template
```

## Usage
```bash
temp ls
```

### create react app
```bash
temp my-app -t react
```

### create react component
```bash
temp Input
```

### create react container component
```bash
temp Input -t container
```

### You can create a configuration file in your current project directory

Create a file in your project folder named `temp.config.js`:

```javascript
module.exporst = {
  aa: {
    from: 'templates/aa.js',
    handle() {
        return {
            to: 'src/bb.js',
        }
    },
  },
  default: {
    from: path.resolve(__dirname, 'tempaltes'),
    handle({ file, name }) {
      return {
        from: path.resolve(this.from, file, file.base),
        to: path.join('src/components', name, file.base),
      };
    },
  },
  bus: {
    extends: 'default',
    handle(a) {
      const result = this.parent.handle(a);
      return Object.assign({}, result, {
        to: result.to.replace(/\bsrc\/components\b/, 'src/scenes/Bus/components'),
      });
    },
  },
};
```

```javascript
import path from 'path';
import shelljs from 'shelljs';
import os from 'os';

const defaultConfig = {
  default: {
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
          'src/components',
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
        to: path.join('src/containers', a.name, filename),
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
        to: path.join('src/reducers', filename),
      };
    },
  },

  react: {
    from: path.resolve(__dirname, '../', 'templates/react'),
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
    post(name) {
      shelljs.cd(name);
      shelljs.sed('-i', /"name":\s+"([^"]+)"/, `"name": "${name}"`, 'package.json');
      const dependencies = [
        'babel-polyfill',
        'classnames',
        'lodash',
        'normalize.css',
        'prop-types',
        'react',
        'react-dom',
        'react-redux',
        'redux',
        'redux-promise',
        'redux-thunk',
      ];
      const devDependencies = [
        'autoprefixer',
        'babel-core',
        'babel-loader',
        'babel-plugin-transform-runtime',
        'babel-preset-es2015',
        'babel-preset-react',
        'babel-preset-react-hmre',
        'babel-preset-stage-0',
        'cross-env',
        'css-loader',
        'extract-text-webpack-plugin',
        'html-webpack-plugin',
        'node-sass',
        'postcss-loader',
        'redux-logger',
        'rimraf',
        'sass-loader',
        'style-loader',
        'url-loader',
        'webpack',
        'webpack-hot-middleware',
      ];
      shelljs.exec(`yarn add ${dependencies.join(' ')}`);
      shelljs.exec(`yarn add --dev ${devDependencies.join(' ')}`);
    },
  },

  pro: {
    from: path.resolve(__dirname, '../', 'templates/pro'),
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
    post(name) {
      shelljs.cd(name);
      shelljs.sed('-i', /"name":\s+"([^"]+)"/, `"name": "${name}"`, 'package.json');
      const devDependencies = ['babel-core', 'babel-preset-es2015', 'babel-preset-stage-0'];
      shelljs.exec(`yarn add --dev ${devDependencies.join(' ')}`);
    },
  },

  dir: {
    from: 'some dir path',
    handle(a) {
      return {
        from: path.resolve(this.from, a.file.base),
        to: path.join(a.name, a.file.dir, a.file.base),
      };
    },
  },
};

function combineConfig(a, b) {
  return Object.keys(a)
    .reduce((acc, key) => {
      const obj = a[key];
      obj.parent = b[obj.extend] || {};
      return {
        ...acc,
        [key]: {
          ...obj.parent,
          ...obj,
        },
      };
    }, {});
}

let selfConfig = {};
let customConfig = {};

try {
  const _config = require(path.resolve(os.homedir(), 'temp.config.js')); // eslint-disable-line
  customConfig = combineConfig(_config, defaultConfig);
} catch (e) {
  // ignore
}

try {
  const _config = require(path.resolve(process.cwd(), 'temp.config.js')); // eslint-disable-line
  selfConfig = combineConfig(_config, defaultConfig);
} catch (e) {
  // ignore
}

export default {
  ...defaultConfig,
  ...customConfig,
  ...selfConfig,
};
```