export default function newDecoder(onError = (err) => { throw err }) {
  let charCode, charLen = 1;
  return (c) => {
    let chr = '';
    if (charLen === 1) {
      if (c > 191 && c < 224) {
        charCode = (c & 31) << 6;
        charLen = 2;
      } else if (c > 223 && c < 240) {
        charCode = (c & 15) << 12;
        charLen = 3;
      } else if (c > 239 && c < 248) {
        charCode = (c & 7) << 18;
        charLen = 4;
      } else {
        charCode = c;
        charLen = 1;
      }
    } else {
      charLen--;
      charCode |= (c & 0x3F) << ((charLen - 1) * 6);
    }
    if (charLen === 1) {
      if (charCode <= 0xffff) {
        chr = String.fromCharCode(charCode);
      } else if (charCode <= 0x10ffff) {
        charCode -= 0x10000;
        chr = String.fromCharCode(charCode >> 10 | 0xd800) +
          String.fromCharCode(charCode & 0x3FF | 0xdc00);
      } else {
        onError(new Error(`UTF-8 decode: charCode point 0x${charCode.toString(16)} exceeds UTF-16 reach`));
      }
    }
    return chr;
  }
}
