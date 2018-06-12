const fs = require('fs');
const { resolve } = require('path');

function getFileList(filePath) {
  const stats = fs.statSync(filePath);
  const result = [];
  if (stats.isDirectory()) {
    const pathList = fs.readdirSync(filePath);
    result.push(...pathList.reduce((acc, path) =>
      [...acc, ...getFileList(resolve(filePath, path))], []));
  } else {
    result.push(filePath);
  }
  return result;
}

exports.getFileList = getFileList;
