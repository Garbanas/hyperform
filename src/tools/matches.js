/* shim layer for the Element.matches method */

const ep = window.Element.prototype;
const nativeMatches = ep.matches ||
                      ep.matchesSelector ||
                      ep.msMatchesSelector ||
                      ep.webkitMatchesSelector;

export default function (element, selector) {
  return nativeMatches.call(element, selector);
}
