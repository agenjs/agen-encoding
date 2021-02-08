import tape from "tape-await";
import * as agen from '../dist/agen-encoding-esm.js';
import { phrases } from './data.js';

for (let [blocks, lines] of phrases) {
  testEncodingDecondingWithLines(blocks, lines);
}

function testEncodingDecondingWithLines(blocks, lines) {
  tape(`encode/decode lines`, async function(t) {
    const f = compose(
      agen.encode(),
      agen.lines()
    );

    let i = 0;
    for await (let line of f(blocks)) {
      t.deepEqual(line, lines[i++]);
    }
  });

  function compose(...list) {
    return async function* (it = []) {
      yield* list.reduce((it, f) => (f ? f(it) : it), it);
    }
  }
}
  