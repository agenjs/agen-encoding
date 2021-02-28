import tape from "tape-await";
import * as agen from '../dist/agen-encoding-esm.js';
import { phrases } from './data.js';

for (let [blocks, lines] of phrases) {
  testLines(blocks, lines);
}

function testLines(blocks, lines) {
  tape(`encode/decode lines`, async function(t) {
    const f = agen.lines();

    let i = 0;
    for await (let line of f(blocks)) {
      const control = removeEol(lines[i++]);
      t.deepEqual(control, line);
    }
  });
  function removeEol(str) {
    let i;
    for (i = str.length - 1; i >= 0; i--) {
      if (str[i] !== '\r' && str[i] !== '\n') break;
    }
    return str.substring(0, i + 1);
  }
}
  