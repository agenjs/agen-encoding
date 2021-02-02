import * as agen from '../dist/agen-encoding-esm.js';

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
