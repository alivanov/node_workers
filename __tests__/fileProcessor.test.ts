import { processFile } from '../src/fileProcessor';
import path from 'path';

describe('processFile', () => {
  it('should extract words from a file', async () => {
    const filePath = path.join(__dirname, 'text_files_directory', 'sample.txt');
    const words = await processFile(filePath);
    expect(words).toEqual(['this', 'is', 'a', 'test', 'file', 'with', 'some', 'words']);
  });

  it('should return an empty array if the file is empty', async () => {
    const filePath = path.join(__dirname, 'text_files_directory', 'empty.txt');
    const words = await processFile(filePath);
    expect(words).toEqual([]);
  });

  it('should handle errors gracefully', async () => {
    const filePath = path.join(__dirname, 'nonexistent.txt');
    const words = await processFile(filePath);
    expect(words).toEqual([]);
  });
});
