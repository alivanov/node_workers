import { readFilesFromDirectory } from '../src/utils';
import path from 'path';

describe('readFilesFromDirectory', () => {
  it('should return only .txt files', async () => {
    const directory = path.join(__dirname, 'text_files_directory');
    const files = await readFilesFromDirectory(directory);

    expect(files).toEqual([path.join(directory, 'empty.txt'), path.join(directory, 'sample.txt')]);
  });

  it('should handle errors gracefully', async () => {
    const directory = path.join(__dirname, 'nonexistentDir');
    const files = await readFilesFromDirectory(directory);
    expect(files).toEqual([]);
  });
});
