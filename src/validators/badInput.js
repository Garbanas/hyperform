import getType from '../tools/getType';
import isValidationCandidate from '../tools/isValidationCandidate';
import stringToDate from '../tools/stringToDate';
import { inputChecked } from '../components/types';


/**
 * test whether the element suffers from bad input
 */
export default function (element) {
  const type = getType(element);

  if (
    !isValidationCandidate(element) ||
    inputChecked.indexOf(type) === -1
  ) {
    /* we're not interested, thanks! */
    return true;
  }

  /* the browser hides some bad input from the DOM, e.g. malformed numbers,
   * email addresses with invalid punycode representation, ... We try to resort
   * to the original method here. The assumption is, that a browser hiding
   * bad input will hopefully also always support a proper
   * ValidityState.badInput */
  if (!element.value) {
    if (
      '_original_validity' in element &&
      !element._original_validity.__hyperform
    ) {
      return !element._original_validity.badInput;
    }
    /* no value and no original badInput: Assume all's right. */
    return true;
  }

  let result = true;
  switch (type) {
    case 'color':
      result = /^#[a-f0-9]{6}$/.test(element.value);
      break;
    case 'number':
    case 'range':
      result = !Number.isNaN(Number(element.value));
      break;
    case 'datetime':
    case 'date':
    case 'month':
    case 'week':
    case 'time':
      result = stringToDate(element.value, type) !== null;
      break;
    case 'datetime-local':
      result = /^([0-9]{4,})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(element.value);
      break;
    case 'tel':
      /* spec says No! Phone numbers can have all kinds of formats, so this
       * is expected to be a free-text field. */
      // TODO we could allow a setting 'phone_regex' to be evaluated here.
      break;
    case 'email':
      break;
    default:
      break;
  }

  return result;
}
