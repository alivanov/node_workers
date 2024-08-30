const fs = require('fs');
const path = require('path');

function readFilesFromDirectory(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) return reject(err);
      const textFiles = files.filter(file => path.extname(file) === '.txt');
      resolve(textFiles.map(file => path.join(directory, file)));
    });
  });
}

module.exports = {
  readFilesFromDirectory,
};
