import { parentPort } from 'worker_threads';

interface WorkerData {
  files: string[];
  minLength: number;
}

parentPort?.on('message', async ({ files, minLength }: WorkerData) => {
  try {
    const { processFile } = await import('./fileProcessor');
    let allWords: string[] = [];

    console.log(`Worker processing files: ${files}`);
    for (const file of files) {
      const words = await processFile(file);
      allWords = allWords.concat(words);
    }

    const wordCounts: Record<string, number> = {};
    allWords.forEach(word => {
      if (word.length >= minLength) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

    console.log(`Worker sending counts back: ${JSON.stringify(wordCounts)}`);
    parentPort?.postMessage(wordCounts);
    console.log('Worker completed processing.');
    parentPort?.close();

  } catch (error: any) {
    console.error('Worker error:', error);
    parentPort?.postMessage({ error: error.message });
    parentPort?.close();
  }
});