@agen/encoding
==============

This package contains methods to encode/decode strings using async generators.

* High-level methods:
  - [encode](#encode-method) encode strings to UTF-8 binary blocks
  - [decode](#decode-method) decodes binary blocks and returns string chunks
  - [lines](#lines-method) decodes binary stream and returns individual lines;
    returned lines have the trailing `"\n"` symbol.
* Main methods for encoding / decoding messages. These methods provide 
  detailed information about exact positions of returned blocks in the stream:
  - [encodeBlocks](#encodeBlocks-method) encodes strings to UTF-8 binary blocks
    and returns byte position and length of the encoded chunks
  - [decodeBlocks](#decodeBlocks-method) decodes binary blocks and returns 
    decoded strings with their byte-level positions in the original stream
  - [decodeLines](#decodeLines-method) decodes individual lines and returns 
    their position in the stream; returned lines have the trailing `"\n"` symbol
* Low-level functions accepting one character / one byte and performing encoding / decoding
  at the byte level:
  - [newEncoder](#newEncoder-method) encodes individual characters
  - [newDecoder](#newDecoder-method) decodes individual bytes

`encode` method
---------------

Encodes strings to UTF-8 binary blocks.
Paramters:
- `blockSize` - maximal length of encoded binary chunks
- `onBlock` - an optional method recieves the full position information 
  of returned blocks; this method is called just before the block is 
  returned by the iterator.
  Structure of the information object:
  - `data` - a byte sequence encoding a string chunk
  - `charIdx` - position of the first encoded character in the initial stream
  - `charLen` - length of the encoded block of characters
  - `byteIdx` - byte position of the encoded block in the resulting binary stream
  - `byteLen` - length of the encoded data block (equals to the data.length)

Example: 
```javascript
import * as agen from '@agen/encoding';

const blockSize = 64;
const f = agen.encode(blockSize);

const textChunks = [
  `съешь же\n ещё`,
  ` этих\n мягких французских \nбулок, `,
  `да выпей\nчаю`
]
for await (let chunk of f(textChunks)) {
  console.log('*', chunk);
}
// Output:
// * Uint8Array(63)[
//   209, 129, 209, 138, 208, 181, 209, 136, 209, 140,
//   32, 208, 182, 208, 181, 10, 32, 208, 181, 209,
//   137, 209, 145, 32, 209, 141, 209, 130, 208, 184,
//   209, 133, 10, 32, 208, 188, 209, 143, 208, 179,
//   208, 186, 208, 184, 209, 133, 32, 209, 132, 209,
//   128, 208, 176, 208, 189, 209, 134, 209, 131, 208,
//   183, 209, 129
// ]
// * Uint8Array(42)[
//   208, 186, 208, 184, 209, 133, 32, 10,
//   208, 177, 209, 131, 208, 187, 208, 190,
//   208, 186, 44, 32, 208, 180, 208, 176,
//   32, 208, 178, 209, 139, 208, 191, 208,
//   181, 208, 185, 10, 209, 135, 208, 176,
//   209, 142
// ]
```

`decode` method
---------------

Decodes binary blocks and returns decoded strings.

Paramters:
- `onBlock` - an optional method recieving full information 
  about the decoded string chunk; this method is called 
  just before the decoded string is returned by the iterator.
  Structure of the information object:
  - `data` - the string chunk
  - `byteIdx` - position of the returned string in the original byte stream
  - `byteLen` - byte lengths of the string
  - `charIdx` - position of the first character of the returned string
  - `charLen` - length of the string chunk (the same as str.length)
  - `firstLine` - line of the first character of the returned string
  - `firstPos` - position on the line for the first character
  - `lastLine` - the line of the last character of the returned string
  - `lastPos` - line position of the last returned character

Example: 
```javascript
import * as agen from '@agen/encoding';

const f = agen.decode();
const blocks = [
  Uint8Array.from([
    209, 129, 209, 138, 208, 181, 209, 136, 209, 140,
    32, 208, 182, 208, 181, 10, 32, 208, 181, 209,
    137, 209, 145, 32, 209, 141, 209, 130, 208, 184,
    209, 133, 10, 32, 208, 188, 209, 143, 208, 179,
    208, 186, 208, 184, 209, 133, 32, 209, 132, 209,
    128, 208, 176, 208, 189, 209, 134, 209, 131, 208,
    183, 209, 129
  ]),
  Uint8Array.from([
    208, 186, 208, 184, 209, 133, 32, 10,
    208, 177, 209, 131, 208, 187, 208, 190,
    208, 186, 44, 32, 208, 180, 208, 176,
    32, 208, 178, 209, 139, 208, 191, 208,
    181, 208, 185, 10, 209, 135, 208, 176,
    209, 142
  ])
];
for await (let str of f(blocks)) {
  console.log('*', str);
}
// Output:
// * съешь же
// ещё этих
// мягких французс
//   * ких
// булок, да выпей
// чаю

```

`lines` method
--------------

Decodes binary stream and returns individual lines.
The returned lines contain the trailing `"\n"` symbol (except, eventually, the last line).

Paramters:
- `onBlock` - an optional method recieving full information 
  about the decoded string chunk; this method is called 
  just before the decoded string is returned by the iterator.
  Structure of the information object:
  - `data` - the string chunk
  - `byteIdx` - position of the returned string in the original byte stream
  - `byteLen` - byte lengths of the string
  - `charIdx` - position of the first character of the returned string
  - `charLen` - length of the string chunk (the same as str.length)
  - `firstLine` - line of the first character of the returned string
  - `firstPos` - position on the line for the first character
  - `lastLine` - the line of the last character of the returned string
  - `lastPos` - line position of the last returned character

Example: 
```javascript
import * as agen from '@agen/encoding';

const f = agen.lines();
const blocks = [
  Uint8Array.from([
    209, 129, 209, 138, 208, 181, 209, 136, 209, 140,
    32, 208, 182, 208, 181, 10, 32, 208, 181, 209,
    137, 209, 145, 32, 209, 141, 209, 130, 208, 184,
    209, 133, 10, 32, 208, 188, 209, 143, 208, 179,
    208, 186, 208, 184, 209, 133, 32, 209, 132, 209,
    128, 208, 176, 208, 189, 209, 134, 209, 131, 208,
    183, 209, 129
  ]),
  Uint8Array.from([
    208, 186, 208, 184, 209, 133, 32, 10,
    208, 177, 209, 131, 208, 187, 208, 190,
    208, 186, 44, 32, 208, 180, 208, 176,
    32, 208, 178, 209, 139, 208, 191, 208,
    181, 208, 185, 10, 209, 135, 208, 176,
    209, 142
  ])
];
for await (let line of f(blocks)) {
  console.log('*', line);
}
// Output:
// * съешь же
//
// *  ещё этих
//
// *  мягких французских 
//
// * булок, да выпей
//
// * чаю

```

`encodeBlocks` method
---------------------

This method recieves strings and transforms them to byte chunks with
associated position information.

Parameters:
- `blockSize` (default: `1024`) - size of generated chunks
- `ArrayType` (default: `Uint8Array`) - type of the generated byte arrays

Returned values have the following structure:
- `data` - a byte sequence encoding a string chunk
- `charIdx` - position of the first encoded character in the initial stream
- `charLen` - length of the encoded block of characters
- `byteIdx` - byte position of the encoded block in the resulting binary stream
- `byteLen` - length of the encoded data block (equals to the data.length)

Example: 
```javascript
import * as agen from '@agen/encoding';

const blockSize = 64;
const f = agen.encodeBlocks(blockSize);

const textChunks = [
  `съешь же\n ещё`,
  ` этих\n мягких французских \nбулок, `,
  `да выпей\nчаю`
]

for await (let info of f(textChunks)) {
  console.log(`-----------`)
  console.log('*', info);
}
// Output:
// -----------
// * {
//   byteIdx: 0,
//   charIdx: 0,
//   byteLen: 63,
//   charLen: 35,
//   data: Uint8Array(63)[
//     209, 129, 209, 138, 208, 181, 209, 136, 209, 140,
//     32, 208, 182, 208, 181, 10, 32, 208, 181, 209,
//     137, 209, 145, 32, 209, 141, 209, 130, 208, 184,
//     209, 133, 10, 32, 208, 188, 209, 143, 208, 179,
//     208, 186, 208, 184, 209, 133, 32, 209, 132, 209,
//     128, 208, 176, 208, 189, 209, 134, 209, 131, 208,
//     183, 209, 129
//   ]
// }
// -----------
// * {
//   byteIdx: 63,
//   charIdx: 35,
//   byteLen: 42,
//   charLen: 24,
//   data: Uint8Array(42)[
//     208, 186, 208, 184, 209, 133, 32, 10,
//     208, 177, 209, 131, 208, 187, 208, 190,
//     208, 186, 44, 32, 208, 180, 208, 176,
//     32, 208, 178, 209, 139, 208, 191, 208,
//     181, 208, 185, 10, 209, 135, 208, 176,
//     209, 142
//   ]
// }

```

`decodeBlocks` method
---------------------

Decodes provided stream of UTF-8 texts. Returns information about indididual blocks 
in the stream - their byte position, character position, byte and char lengths, also
the line numbers and line positions of the beginning and block ends.

Parameters:
- `splitter` - optional splitter; with this parameter this method
  additionally splits blocks; it can be useful to split the strim to new lines
  (by the '\n' symbol). Note that to re-create full lines the returned blocks should be 
  analized and concatenated together if they are started on the same line. 

The returned messages have the following structure:
- `data` - the string chunk
- `byteIdx` - position of the returned string in the original byte stream
- `byteLen` - byte lengths of the string
- `charIdx` - position of the first character of the returned string
- `charLen` - length of the string chunk (the same as str.length)
- `firstLine` - line of the first character of the returned string
- `firstPos` - position on the line for the first character
- `lastLine` - the line of the last character of the returned string
- `lastPos` - line position of the last returned character

Example: 
```javascript

import * as agen from '@agen/encoding';

const f = agen.decodeBlocks();

const blocks = [
  Uint8Array.from([
    209, 129, 209, 138, 208, 181, 209, 136, 209, 140,
    32, 208, 182, 208, 181, 10, 32, 208, 181, 209,
    137, 209, 145, 32, 209, 141, 209, 130, 208, 184,
    209, 133, 10, 32, 208, 188, 209, 143, 208, 179,
    208, 186, 208, 184, 209, 133, 32, 209, 132, 209,
    128, 208, 176, 208, 189, 209, 134, 209, 131, 208,
    183, 209, 129
  ]),
  Uint8Array.from([
    208, 186, 208, 184, 209, 133, 32, 10,
    208, 177, 209, 131, 208, 187, 208, 190,
    208, 186, 44, 32, 208, 180, 208, 176,
    32, 208, 178, 209, 139, 208, 191, 208,
    181, 208, 185, 10, 209, 135, 208, 176,
    209, 142
  ])
];

for await (let info of f(blocks)) {
  console.log(`-----------`)
  console.log('*', info);
}
// Output:
// -----------
// * {
//   charIdx: 0,
//   charLen: 35,
//   byteIdx: 0,
//   byteLen: 63,
//   firstLine: 0,
//   firstPos: 0,
//   lastLine: 2,
//   lastPos: 16,
//   data: 'съешь же\n ещё этих\n мягких французс'
// }
// -----------
// * {
//   charIdx: 35,
//   charLen: 24,
//   byteIdx: 63,
//   byteLen: 42,
//   firstLine: 2,
//   firstPos: 16,
//   lastLine: 4,
//   lastPos: 3,
//   data: 'ких \nбулок, да выпей\nчаю'
// }
```

`decodeLines` method
--------------------

Decodes and returns individual lines from the byte stream. The returned lines
are associated with their position information.
All lines contain the trailing `"\n"` symbol except, eventually, the last one.

The returned messages have the following structure:
- `data` - the line string; it contains the `\\n` symbol at the end.
- `byteIdx` - byte position of the returned line in the original byte stream
- `byteLen` - byte lengths of the line
- `charIdx` - position of the first character of the line
- `charLen` - length of the line (the same as data.length)
- `firstLine` - line of the first character of the returned string
- `firstPos` - position on the line for the first character (it is always 0)
- `lastLine` - the line of the last character of the returned string
- `lastPos` - line position of the last returned character; 
   it is 0 most of the time and can be different for the last line
Example: 
```javascript
import * as agen from '@agen/encoding';

const f = agen.decodeLines();

const blocks = [
  Uint8Array.from([
    209, 129, 209, 138, 208, 181, 209, 136, 209, 140,
    32, 208, 182, 208, 181, 10, 32, 208, 181, 209,
    137, 209, 145, 32, 209, 141, 209, 130, 208, 184,
    209, 133, 10, 32, 208, 188, 209, 143, 208, 179,
    208, 186, 208, 184, 209, 133, 32, 209, 132, 209,
    128, 208, 176, 208, 189, 209, 134, 209, 131, 208,
    183, 209, 129
  ]),
  Uint8Array.from([
    208, 186, 208, 184, 209, 133, 32, 10,
    208, 177, 209, 131, 208, 187, 208, 190,
    208, 186, 44, 32, 208, 180, 208, 176,
    32, 208, 178, 209, 139, 208, 191, 208,
    181, 208, 185, 10, 209, 135, 208, 176,
    209, 142
  ])
];

for await (let info of f(blocks)) {
  console.log(`-----------`)
  console.log('*', info);
}
// Output:
// -----------
// * {
//   charIdx: 0,
//   charLen: 9,
//   byteIdx: 0,
//   byteLen: 16,
//   firstLine: 0,
//   firstPos: 0,
//   lastLine: 1,
//   lastPos: 0,
//   data: "съешь же\n"
// }
// -----------
// * {
//   charIdx: 9,
//   charLen: 10,
//   byteIdx: 16,
//   byteLen: 17,
//   firstLine: 1,
//   firstPos: 0,
//   lastLine: 2,
//   lastPos: 0,
//   data: " ещё этих\n"
// }
// -----------
// * {
//   charIdx: 19,
//   charLen: 21,
//   byteIdx: 33,
//   byteLen: 38,
//   firstLine: 2,
//   firstPos: 0,
//   lastLine: 3,
//   lastPos: 0,
//   data: " мягких французских \n"
// }
// -----------
// * {
//   charIdx: 40,
//   charLen: 16,
//   byteIdx: 71,
//   byteLen: 28,
//   firstLine: 3,
//   firstPos: 0,
//   lastLine: 4,
//   lastPos: 0,
//   data: "булок, да выпей\n"
// }
// -----------
// * {
//   charIdx: 56,
//   charLen: 3,
//   byteIdx: 99,
//   byteLen: 6,
//   firstLine: 4,
//   firstPos: 0,
//   lastLine: 4,
//   lastPos: 3,
//   data: "чаю"
// }
```

`newEncoder` method
-------------------

This method accepts one character code, updates the given buffer and returns 
the number of written bytes.

Returned method accepts the following parameters:
- `code` - code of the character to encode
- `buf` - buffer where character bytes should be written
- `idx` - start position in the buffer where encoded bytes should be written

This method returns the number of encoded bytes.

Example: 
```javascript
import * as agen from '@agen/encoding';

const enc = agen.newEncoder();
const charCode = 'ё'.charCodeAt(0);
const buf = [0, 0, 0, 0];
const len = enc(charCode, buf, 0);
console.log('Number of written bytes:', len);
console.log('Buffer content:', buf);
// Output:
// Number of written bytes: 2
// Buffer content: [209, 145, 0, 0]
```

`newDecoder` method
-------------------

This method accepts one byte and returns a string with the decoded characters.

Returned method accepts the following parameters:
- `byte` - one byte from the stream

This method returns a string with the decoded characters. If there is no 
characters ready to output then it returns an empty string.

Example: 
```javascript
import * as agen from '@agen/encoding';

const dec = agen.newDecoder();
const buf = [ 209, 145 ];
for (let i = 0; i < buf.length; i++) {
  const byte = buf[i];
  let s = dec(byte);
  console.log(`${i}) ${byte} - "${s}"`);
}
// Output:
// 0) 209 - ""
// 1) 145 - "ё"
```

