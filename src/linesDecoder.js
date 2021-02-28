import decodeLines from './decodeLines.js';

export default function linesDecoder(splitter, onBlock) {
  if (typeof splitter === 'function') { onBlock = splitter; splitter = undefined; }
  return async function* (it) {
    const decoder = decodeLines(splitter);
    for await (let block of decoder(it)) {
      onBlock && await onBlock(block);
      yield block.data;
    }
  }
}
