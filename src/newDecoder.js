export default function newDecoder(onError = (err) => { throw err }) {
  let char, charLen = 1;
  return (c) => {
    let chr = '';
    if (charLen === 1) {
      if (c > 191 && c < 224) {
        char = (c & 31) << 6;
        charLen = 2;
      } else if (c > 223 && c < 240) {
        c = (c & 15) << 12;
        charLen = 3;
      } else if (c > 239 && c < 248) {
        char = (c & 7) << 18;
        charLen = 4;
      } else {
        char = c;
        charLen = 1;
      }
    } else {
      char |= (c & 63) << ((charLen - 2) * 6);
      charLen--;
    }
    if (charLen === 1) {
      if (char <= 0xffff) {
        chr = String.fromCharCode(char);
      } else if (char <= 0x10ffff) {
        char -= 0x10000;
        chr = String.fromCharCode(char >> 10 | 0xd800) +
          String.fromCharCode(char & 0x3FF | 0xdc00);
      } else {
        onError(new Error(`UTF-8 decode: code point 0x${char.toString(16)} exceeds UTF-16 reach`));
      }
    }
    return chr;
  }
}
