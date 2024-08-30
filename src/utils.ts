/* const fs = require('fs');
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
}; */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export async function readFilesFromDirectory(directory: string): Promise<string[]> {
  try {
    const files = await readdir(directory);
    const textFiles: string[] = [];

    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStat = await stat(filePath);

      if (fileStat.isFile() && path.extname(file) === '.txt') {
        textFiles.push(filePath);
      }
    }

    return textFiles;
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}
