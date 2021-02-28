
export default function slicer(splitter, slice, length) {
  length = length || ((block) => block.byteLength || block.length || 0);
  slice = slice || ((block, offset, len, blockLen) => {
    if (offset === 0 && len === blockLen) return block;
    return block.slice
      ? block.slice(offset, offset + len)
      : block.substring(offset, offset + len);
  })
  return async function*(it) {
    let block, blockLen = -1, finished = false;
    while (!finished) { yield nextChunk(); }

    async function* nextChunk() {
      while (true) {
        if (!block) {
          const slot = await it.next();
          if (slot.done) { 
            finished = true;
            break;
          }
          block = slot.value;
          blockLen = length(block);
        }
        const splitIndex = splitter(block, blockLen);
        if (splitIndex === 0) { break; }
        else if (splitIndex > 0 && splitIndex < blockLen) {
          const chunk = slice(block, 0, splitIndex, blockLen);
          const n = blockLen - splitIndex;
          block = slice(block, splitIndex, n, blockLen);
          blockLen = n;
          yield chunk;
          break;
        } else {
          yield block;
          block = null;
          blockLen = -1;
        }
      }
    }
  }
}

slicer.splitByLength = function splitByLength(len = +Infinity) {
  function splitter(block, blockLen) {
    const index = Math.min(len, blockLen);
    len -= index;
    return index;
  }
  splitter.length = function () {
    if (!arguments.length) return len;
    len = +(arguments[0] || 0);
    return splitter;
  }
  return splitter;
}

slicer.splitByValue = function splitByValue(value) {
  function splitter(block, blockLen) {
    let index;
    for (index = 0; index < blockLen; index++) {
      if (block[index] === value) break;
    }
    return index;
  }
  splitter.value = function () {
    if (!arguments.length) return value;
    value = arguments[0];
    return splitter;
  }
  return splitter;
}