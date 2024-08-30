const fs = require('fs');

function processFile(filePath) {
  return new Promise((resolve, reject) => {
    console.log(`Processing file: ${filePath}`);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      
      const words = data
        .replace(/[^\w\s]/g, '')
        .toLowerCase()
        .split(/\s+/);

      console.log(`File ${filePath} contains ${words.length} words`);
      resolve(words);
    });
  });
}

module.exports = {
  processFile,
};