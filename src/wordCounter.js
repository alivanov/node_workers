const { parentPort } = require('worker_threads');

parentPort.on('message', ({ words, minLength }) => {
  try {
    const wordCounts = {};

    words.forEach(word => {
      if (word.length >= minLength) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

    parentPort.postMessage(wordCounts);

    parentPort.close();

  } catch (error) {
    console.error('Error in worker:', error);
    parentPort.postMessage({ error: error.message });
    parentPort.close();
  }
});