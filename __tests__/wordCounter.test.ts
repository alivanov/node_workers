import { Worker } from 'worker_threads';
import path from 'path';

describe('wordCounter worker', () => {
  it('should count words correctly', (done) => {
    const worker = new Worker(path.resolve(__dirname, '../dist/wordCounter.js'));

    worker.postMessage({
        files: [path.join(__dirname, 'text_files_directory', 'sample.txt')],
        minLength: 3
    });

    worker.on('message', (wordCounts: Record<string, number>) => {
      expect(wordCounts).toEqual({
        this: 1,
        test: 1,
        file: 1,
        with: 1,
        some: 1,
        words: 1
      });
      done();
    });

    worker.on('error', (error) => {
      done(error);
    });
  });

  it('should handle empty files', (done) => {
    const worker = new Worker(path.resolve(__dirname, '../dist/wordCounter.js'));

    worker.postMessage({
        files: [path.join(__dirname, 'text_files_directory', 'empty.txt')],
        minLength: 3
    });

    worker.on('message', (wordCounts: Record<string, number>) => {
      expect(wordCounts).toEqual({});
      done();
    });

    worker.on('error', (error) => {
      done(error);
    });
  });
});
