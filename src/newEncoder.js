export default function newEncoder() {
  let surrogate = false, code = 0;
  return (c, buf, idx) => {
    let i = idx;
    if (!surrogate) {
      code = c;
      if (code < 0x80) buf[i++] = code;
      else if (code < 0x800) {
        buf[i++] = 0xc0 | (code >> 6);
        buf[i++] = 0x80 | (code & 0x3f);
      } else if (code < 0xd800 || code >= 0xe000) {
        buf[i++] = (0xe0 | (code >> 12));
        buf[i++] = (0x80 | ((code >> 6) & 0x3f));
        buf[i++] = (0x80 | (code & 0x3f));
      } else { // surrogate pair
        code = ((code & 0x3ff) << 10);
        surrogate = true;
      }
    } else {
      surrogate = false;
      code = code | (c & 0x3ff);
      buf[i++] = (0xf0 | (code >> 18));
      buf[i++] = (0x80 | ((code >> 12) & 0x3f));
      buf[i++] = (0x80 | ((code >> 6) & 0x3f));
      buf[i++] = (0x80 | (code & 0x3f));
    }
    return i - idx;
  }
}