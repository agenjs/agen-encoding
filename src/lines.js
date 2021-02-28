export default function lines(split = (str => str.split(/\r?\n/))) {
  return async function*(it) {
    let buffer;
    for await (let chunk of it) {
      buffer = buffer || '';
      buffer += chunk;
      const lines = split(buffer);
      buffer = lines.pop();
      yield* lines;
    }
    if (buffer !== undefined) yield buffer;
  }
}