export default function (str, ...args) {
  const argsLength = args.length;
  let globalIndex = 0;

  return str.replace(/%([0-9]+\$)?([sl])/g, (match, position, type) => {
    let localIndex = globalIndex;
    if (position) {
      localIndex = Number(position.replace(/\$$/, '')) - 1;
    }
    globalIndex += 1;

    let arg = '';
    if (argsLength > localIndex) {
      arg = args[localIndex];
    }

    if (arg instanceof Date ||
        typeof arg === 'number' ||
        arg instanceof Number) {
      /* try getting a localized representation of dates and numbers, if the
       * browser supports this */
      if (type === 'l') {
        arg = (arg.toLocaleString || arg.toString).call(arg);
      } else {
        arg = arg.toString();
      }
    }

    return arg;
  });
}
