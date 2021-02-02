import * as agen from '../dist/agen-encoding-esm.js';

const dec = agen.newDecoder();
const buf = [209, 145];
for (let i = 0; i < buf.length; i++) {
  const byte = buf[i];
  let s = dec(byte);
  console.log(`${i}) ${byte} - "${s}"`);
}
// Output:
// 0) 209 - ""
// 1) 145 - "ё"