/**
 * Implement constraint checking functionality defined in the HTML5 standard
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-cva-validity
 * @return bool true if the test fails [!], false otherwise
 */


import formatDate from './formatDate';
import getNextValid from './getNextValid';
import getType from './getType';
import sprintf from './sprintf';
import stringToNumber from './stringToNumber';
import stringToDate from './stringToDate';
import unicodeStringLength from './unicodeStringLength';
import customMessages from '../components/customMessages';
import _ from '../components/localization';
import messageStore from '../components/messageStore';
import CustomValidatorRegistry from '../components/registry';
import { getWrapper } from '../components/wrapper';
import testBadInput from '../validators/badInput';
import testMax from '../validators/max';
import testMaxlength from '../validators/maxlength';
import testMin from '../validators/min';
import testMinlength from '../validators/minlength';
import testPattern from '../validators/pattern';
import testRequired from '../validators/required';
import testStep from '../validators/step';
import testType from '../validators/type';
import {CLASS_IN_RANGE, CLASS_OUT_OF_RANGE} from "../constants/Classes";


/**
 * boilerplate function for all tests but customError
 */
function check(test, react) {
  return (element) => {
    const invalid = !test(element);
    if (invalid) {
      react(element);
    }
    return invalid;
  };
}


/**
 * create a common function to set error messages
 */
function setMsg(element, msgtype, _default) {
  messageStore.set(element, customMessages.get(element, msgtype, _default));
}


const badInput = check(testBadInput, element => setMsg(element, 'badInput', _('Please match the requested type.')));


function customError(element) {
  /* check, if there are custom validators in the registry, and call
   * them. */
  const customValidators = CustomValidatorRegistry.get(element);
  const cvl = customValidators.length;
  let valid = true;

  if (cvl) {
    for (let i = 0; i < cvl; i++) {
      const result = customValidators[i](element);
      if (result !== undefined && !result) {
        valid = false;
        /* break on first invalid response */
        break;
      }
    }
  }

  /* check, if there are other validity messages already */
  if (valid) {
    const msg = messageStore.get(element);
    valid = !(msg.toString() && ('is_custom' in msg));
  }

  return !valid;
}


const patternMismatch = check(testPattern, (element) => {
  setMsg(
    element,
    'patternMismatch',
    element.title ?
      sprintf(_('PatternMismatchWithTitle'), element.title)
      :
      _('PatternMismatch'),
  );
});


/**
 * TODO: when rangeOverflow and rangeUnderflow are both called directly and
 * successful, the inRange and outOfRange classes won't get removed, unless
 * element.validityState.valid is queried, too.
 */
const rangeOverflow = check(testMax, (element) => {
  const type = getType(element);
  const wrapper = getWrapper(element);
  const outOfRangeClass = (wrapper && wrapper.settings.classes.outOfRange) || CLASS_OUT_OF_RANGE;
  const inRangeClass = (wrapper && wrapper.settings.classes.inRange) || CLASS_IN_RANGE;

  let msg;

  switch (type) {
    case 'date':
    case 'datetime':
    case 'datetime-local':
      msg = sprintf(_('DateRangeOverflow'), formatDate(stringToDate(element.getAttribute('max'), type), type));
      break;
    case 'time':
      msg = sprintf(_('TimeRangeOverflow'), formatDate(stringToDate(element.getAttribute('max'), type), type));
      break;
    // case 'number':
    default:
      msg = sprintf(_('NumberRangeOverflow'), stringToNumber(element.getAttribute('max'), type));
      break;
  }

  setMsg(element, 'rangeOverflow', msg);
  element.classList.add(outOfRangeClass);
  element.classList.remove(inRangeClass);
});


const rangeUnderflow = check(testMin, (element) => {
  const type = getType(element);
  const wrapper = getWrapper(element);
  const outOfRangeClass = (wrapper && wrapper.settings.classes.outOfRange) || CLASS_OUT_OF_RANGE;
  const inRangeClass = (wrapper && wrapper.settings.classes.inRange) || CLASS_IN_RANGE;

  let msg;

  switch (type) {
    case 'date':
    case 'datetime':
    case 'datetime-local':
      msg = sprintf(_('DateRangeUnderflow'), formatDate(stringToDate(element.getAttribute('min'), type), type));
      break;
    case 'time':
      msg = sprintf(_('TimeRangeUnderflow'), formatDate(stringToDate(element.getAttribute('min'), type), type));
      break;
    // case 'number':
    default:
      msg = sprintf(_('NumberRangeUnderflow'), stringToNumber(element.getAttribute('min'), type));
      break;
  }

  setMsg(element, 'rangeUnderflow', msg);
  element.classList.add(outOfRangeClass);
  element.classList.remove(inRangeClass);
});


const stepMismatch = check(testStep, (element) => {
  const list = getNextValid(element);
  const min = list[0];
  const max = list[1];
  let sole = false;
  let msg;

  if (min === null) {
    sole = max;
  } else if (max === null) {
    sole = min;
  }

  if (sole !== false) {
    msg = sprintf(_('StepMismatchOneValue'), sole);
  } else {
    msg = sprintf(_('StepMismatch'), min, max);
  }
  setMsg(element, 'stepMismatch', msg);
});


const tooLong = check(testMaxlength, (element) => {
  setMsg(
    element,
    'tooLong',
    sprintf(
      _('TextTooLong'),
      element.getAttribute('maxlength'),
      unicodeStringLength(element.value),
    ),
  );
});


const tooShort = check(testMinlength, (element) => {
  setMsg(
    element,
    'tooShort',
    sprintf(
      _('Please lengthen this text to %l characters or more (you are currently using %l characters).'),
      element.getAttribute('minlength'),
      unicodeStringLength(element.value),
    ),
  );
});


const typeMismatch = check(testType, (element) => {
  let msg = _('Please use the appropriate format.');
  const type = getType(element);

  if (type === 'email') {
    if (element.hasAttribute('multiple')) {
      msg = _('Please enter a comma separated list of email addresses.');
    } else {
      msg = _('InvalidEmail');
    }
  } else if (type === 'url') {
    msg = _('InvalidURL');
  } else if (type === 'file') {
    msg = _('Please select a file of the correct type.');
  }

  setMsg(element, 'typeMismatch', msg);
});


const valueMissing = check(testRequired, (element) => {
  let msg = _('ValueMissing');
  const type = getType(element);

  if (type === 'checkbox') {
    msg = _('CheckboxMissing');
  } else if (type === 'radio') {
    msg = _('RadioMissing');
  } else if (type === 'file') {
    if (element.hasAttribute('multiple')) {
      msg = _('Please select one or more files.');
    } else {
      msg = _('FileMissing');
    }
  } else if (element instanceof window.HTMLSelectElement) {
    msg = _('SelectMissing');
  }

  setMsg(element, 'valueMissing', msg);
});


export default {
  badInput,
  customError,
  patternMismatch,
  rangeOverflow,
  rangeUnderflow,
  stepMismatch,
  tooLong,
  tooShort,
  typeMismatch,
  valueMissing,
};
