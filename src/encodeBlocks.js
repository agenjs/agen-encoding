import newEncoder from './newEncoder.js';

/**
 * Returns byte blocks with associated position information.
 * - data - a byte sequence encoding a string chunk
 * - charIdx - position of the first encoded character in the initial stream
 * - charLen - length of the encoded block of characters
 * - byteIdx - byte position of the encoded block in the resulting binary stream
 * - byteLen - length of the encoded data block (equals to the data.length)
 */
export default function encodeBlocks(blockSize = 1024, ArrayType = Uint8Array /* Uint8ClampedArray */) {
  return async function* (it) {
    let byteIdx = 0;
    let charIdx = 0;
    const enc = newEncoder();
    const fullBlockSize = blockSize + 4;
    let array = new ArrayType(fullBlockSize);
    let info = { byteIdx, charIdx, byteLen: 0, charLen: 0 };
    let idx = 0;

    for await (let str of it) {
      for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        let len = enc(c, array, idx);
        if (len) {
          if (idx + len > blockSize) {
            info.byteLen = byteIdx - info.byteIdx;
            info.charLen = charIdx - info.charIdx;
            info.data = array.subarray(0, info.byteLen);
            // info.data = array.slice(0, info.byteLen);
            if (info.byteLen > 0) yield info;
            info = { byteIdx, charIdx, byteLen: 0, charLen: 0 };
            const prev = array;
            array = new ArrayType(fullBlockSize);
            for (let i = 0; i < len; i++) {
              array[i] = prev[idx + i];
            }
            idx = 0;
          }
          idx += len;
          byteIdx += len;
        }
        charIdx++;
      }
    }
    if (idx > 0) {
      info.byteLen = byteIdx - info.byteIdx;
      info.charLen = charIdx - info.charIdx;
      info.data = array.subarray(0, info.byteLen);
      yield info;
    }
  }
}