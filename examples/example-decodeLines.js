import * as agen from '../dist/agen-encoding-esm.js';

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

