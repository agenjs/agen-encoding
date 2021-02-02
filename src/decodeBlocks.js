import newDecoder from './newDecoder.js';

/**
 * Decodes provided stream of UTF-8 texts. Returns information about indididual blocks 
 * in the stream - their byte position, character position, byte and char lengths, also
 * the line numbers and line positions of the beginning and block ends.
 * @param char splitter - optional splitter; with this parameter this method
 * additionally splits blocks; it can be useful to split the strim to new lines
 * (by the '\n' symbol). Note that to re-create full lines the returned blocks should be 
 * analized and concatenated together if they are started on the same line. 
 *
 * The returned messages have the following structure:
 * - data - the string chunk
 * - byteIdx - position of the returned string in the original byte stream
 * - byteLen - byte lengths of the string
 * - charIdx - position of the first character of the returned string
 * - charLen - length of the string chunk (the same as str.length)
 * - firstLine - line of the first character of the returned string
 * - firstPos - position on the line for the first character
 * - lastLine - the line of the last character of the returned string
 * - lastPos - line position of the last returned character
 */
export default function decodeBlocks(splitter) {
  return async function* (it) {
    const dec = newDecoder();
    let charIdx = 0, byteIdx = 0, line = 0, linePos = 0;
    const newInfo = () => ({
      charIdx, charLen: 0,
      byteIdx, byteLen: 0,
      firstLine: line, firstPos: linePos,
      lastLine: line, lastPos: linePos
    })
    let info = newInfo();
    let data = '';
    const getInfo = () => {
      info.byteLen = byteIdx - info.byteIdx;
      info.charLen = charIdx - info.charIdx;
      info.lastLine = line;
      info.lastPos = linePos;
      info.data = data;
      const result = info;
      data = '';
      info = newInfo();
      return result;
    }
    for await (let block of it) {
      for (let i = 0; i < block.length; i++) {
        let ch = dec(block[i]);
        const len = ch.length;
        byteIdx++;
        if (len) {
          data += ch;
          let inc = 0;
          if (ch === '\r') { linePos = 0; }
          else if (ch === '\n') { line++; linePos = 0; }
          else { inc = len; }
          charIdx += len;
          linePos += inc;
          if (splitter === ch) { yield getInfo(); }
        }
      }
      if (data.length) { yield getInfo(); }
    }
    if (data.length) { yield getInfo(); }
  }
}