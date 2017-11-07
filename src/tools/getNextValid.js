import dateToString from './dateToString';
import stringToNumber from './stringToNumber';
import getType from './getType';
import _ from '../components/localization';
import {
  defaultStep,
  stepScaleFactor,
  defaultStepBase,
  defaultMin,
  defaultMax,
} from '../components/stepDefaults';
import { dates } from '../components/types';


/**
 * get previous and next valid values for a stepped input element
 */
export default function (element, n = 1) {
  const type = getType(element);

  const aMin = element.getAttribute('min');
  let min = defaultMin[type] || NaN;
  if (aMin) {
    const pMin = stringToNumber(aMin, type);
    if (!Number.isNaN(pMin)) {
      min = pMin;
    }
  }

  const aMax = element.getAttribute('max');
  let max = defaultMax[type] || NaN;
  if (aMax) {
    const pMax = stringToNumber(aMax, type);
    if (!Number.isNaN(pMax)) {
      max = pMax;
    }
  }

  const aStep = element.getAttribute('step');
  let step = defaultStep[type] || 1;
  if (aStep && aStep.toLowerCase() === 'any') {
    /* quick return: we cannot calculate prev and next */
    return [_('any value'), _('any value')];
  } else if (aStep) {
    const pStep = stringToNumber(aStep, type);
    if (!Number.isNaN(pStep)) {
      step = pStep;
    }
  }

  const defaultValue = stringToNumber(element.getAttribute('value'), type);

  const value = stringToNumber(element.value || element.getAttribute('value'), type);

  if (Number.isNaN(value)) {
    /* quick return: we cannot calculate without a solid base */
    return [_('any valid value'), _('any valid value')];
  }

  let stepBase;
  if (!Number.isNaN(min)) {
    stepBase = min;
  } else if (!Number.isNaN(defaultValue)) {
    stepBase = defaultValue;
  } else {
    stepBase = defaultStepBase[type] || 0;
  }

  const scale = stepScaleFactor[type] || 1;

  let prev = stepBase + (Math.floor((value - stepBase) / (step * scale)) * (step * scale) * n);
  let next = stepBase + ((Math.floor((value - stepBase) / (step * scale)) + 1) * (step * scale) * n);

  if (prev < min) {
    prev = null;
  } else if (prev > max) {
    prev = max;
  }

  if (next > max) {
    next = null;
  } else if (next < min) {
    next = min;
  }

  /* convert to date objects, if appropriate */
  if (dates.indexOf(type) > -1) {
    prev = dateToString(new Date(prev), type);
    next = dateToString(new Date(next), type);
  }

  return [prev, next];
}
