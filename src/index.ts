import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import path from 'path';
import { readFilesFromDirectory } from './utils';
import { processFile } from './fileProcessor';

const MIN_WORD_LENGTH = 5;

if (isMainThread) {
  async function main(directory: string): Promise<void> {
    try {
      console.log(`Reading files from directory: ${directory}`);
      const files = await readFilesFromDirectory(directory);
      console.log(`Found files: ${files}`);

      if (files.length === 0) {
        console.log('No text files found in the directory.');
        return;
      }

      const fileChunks = chunkArray(files, 4);

      const workers = fileChunks.map(chunk => {
        console.log(`Creating worker for files: ${chunk}`);
        return new Worker(__filename, { workerData: { files: chunk, minLength: MIN_WORD_LENGTH } });
      });

      const wordCounts: { [key: string]: number } = {};

      const workerPromises = workers.map(worker => new Promise<void>((resolve, reject) => {
        worker.on('message', (counts: { [key: string]: number }) => {
          console.log('Received counts from worker:', counts);
          for (const [word, count] of Object.entries(counts)) {
            wordCounts[word] = (wordCounts[word] || 0) + count;
          }
        });

        worker.on('error', (error: Error) => {
          console.error(`Worker error: ${error}`);
          reject(error);
        });

        worker.on('exit', (code: number) => {
          console.log(`Worker exited with code: ${code}`);
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          } else {
            resolve();
          }
        });
      }));

      console.log('Waiting for all workers to finish...');
      await Promise.all(workerPromises);
      console.log('All workers finished.');

      const sortedWords = Object.entries(wordCounts).sort(([, a], [, b]) => b - a).slice(0, 10);
      console.log('Top 10 words:', sortedWords);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  main(path.resolve(__dirname, '../text_files_directory'));
} else {
  const { files, minLength } = workerData as { files: string[], minLength: number };

  (async () => {
    try {
      let allWords: string[] = [];
      console.log(`Worker processing files: ${files}`);
      for (const file of files) {
        const words = await processFile(file);
        allWords = allWords.concat(words);
      }

      const wordCounts: { [key: string]: number } = {};
      allWords.forEach(word => {
        if (word.length >= minLength) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });

      console.log(`Worker sending counts back: ${JSON.stringify(wordCounts)}`);
      parentPort?.postMessage(wordCounts);
      console.log('Worker completed processing.');
      parentPort?.close();

    } catch (error) {
      console.error('Worker error:', error);
    }
  })();
}
