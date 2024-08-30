/* const fs = require('fs');

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
}; */

import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export async function processFile(filePath: string): Promise<string[]> {
  try {
    console.log(`Processing file: ${filePath}`);
    const data = await readFile(filePath, 'utf8');
    const words = data.match(/\b\w+\b/g) || [];
    console.log(`File ${filePath} contains ${words.length} words`);

    return words.map(word => word.toLowerCase());
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
}