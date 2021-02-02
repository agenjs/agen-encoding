import decodeBlocks from './decodeBlocks.js';

export default function decodeLines(splitter = '\n') {
  return async function* (it) {
    const decoder = decodeBlocks(splitter);
    let prev;
    for await (let next of decoder(it)) {
      if (!prev || prev.firstLine !== next.firstLine) {
        if (prev) yield prev;
        prev = Object.assign({}, next);
      } else {
        prev.data += next.data;
        prev.byteLen += next.byteLen;
        prev.charLen += next.charLen;
        prev.lastLine = next.lastLine;
        prev.lastPos = next.lastPos;
      }
    }
    if (prev) yield prev;
  }
}