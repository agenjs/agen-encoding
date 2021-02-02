import decodeBlocks from './decodeBlocks.js';

export default function decode(onBlock = (()=>{})) {
  return async function* (it) {
    const decoder = decodeBlocks();
    for await (let block of decoder(it)) {
      await onBlock(block);
      yield block.data;
    }
  }
}