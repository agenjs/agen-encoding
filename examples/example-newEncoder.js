import * as agen from '../dist/agen-encoding-esm.js';

const enc = agen.newEncoder();
const charCode = 'ё'.charCodeAt(0);
const buf = [0, 0, 0, 0];
const len = enc(charCode, buf, 0);
console.log('Number of written bytes:', len);
console.log('Buffer content:', buf);

// Output:
// Number of written bytes: 2
// Buffer content: [209, 145, 0, 0]
