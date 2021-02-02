import encodeBlocks from './encodeBlocks.js';

export default function encode(blockSize, onBlock=()=>{}) {
  return async function* (it) {
    const blocks = encodeBlocks(blockSize);
    for await (let block of blocks(it)) {
      await onBlock(block);
      yield block.data;
    }
  }
}  