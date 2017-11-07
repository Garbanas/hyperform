import isValidationCandidate from '../tools/isValidationCandidate';
import mark from '../tools/mark';
import messageStore from '../components/messageStore';
import { getWrapper } from '../components/wrapper';
import validityStateCheckers from '../tools/validityStateCheckers';


/**
 * the validity state constructor
 */
const ValidityState = function (element) {
  if (!(element instanceof window.HTMLElement)) {
    throw new Error('cannot create a ValidityState for a non-element');
  }

  const cached = ValidityState.cache.get(element);
  if (cached) {
    return cached;
  }

  if (!(this instanceof ValidityState)) {
    /* working around a forgotten `new` */
    return new ValidityState(element);
  }

  this.element = element;
  ValidityState.cache.set(element, this);
  return this;
};


/**
 * the prototype for new validityState instances
 */
const ValidityStatePrototype = {};
ValidityState.prototype = ValidityStatePrototype;

ValidityState.cache = new WeakMap();

/**
 * copy functionality from the validity checkers to the ValidityState
 * prototype
 */
for (const prop in validityStateCheckers) {
  Object.defineProperty(ValidityStatePrototype, prop, {
    configurable: true,
    enumerable: true,
    get: (func => function () {
      return func(this.element);
    })(validityStateCheckers[prop]),
    set: undefined,
  });
}

/**
 * the "valid" property calls all other validity checkers and returns true,
 * if all those return false.
 *
 * This is the major access point for _all_ other API methods, namely
 * (check|report)Validity().
 */
Object.defineProperty(ValidityStatePrototype, 'valid', {
  configurable: true,
  enumerable: true,
  get() {
    const wrapper = getWrapper(this.element);
    const validClass = (wrapper && wrapper.settings.classes.valid) || 'hf-valid';
    const invalidClass = (wrapper && wrapper.settings.classes.invalid) || 'hf-invalid';
    const userInvalidClass = (wrapper && wrapper.settings.classes.userInvalid) || 'hf-user-invalid';
    const userValidClass = (wrapper && wrapper.settings.classes.userValid) || 'hf-user-valid';
    const inRangeClass = (wrapper && wrapper.settings.classes.inRange) || 'hf-in-range';
    const outOfRangeClass = (wrapper && wrapper.settings.classes.outOfRange) || 'hf-out-of-range';
    const validatedClass = (wrapper && wrapper.settings.classes.validated) || 'hf-validated';

    this.element.classList.add(validatedClass);

    if (isValidationCandidate(this.element)) {
      for (const prop in validityStateCheckers) {
        if (validityStateCheckers[prop](this.element)) {
          this.element.classList.add(invalidClass);
          this.element.classList.remove(validClass);
          this.element.classList.remove(userValidClass);
          if (this.element.value !== this.element.defaultValue) {
            this.element.classList.add(userInvalidClass);
          } else {
            this.element.classList.remove(userInvalidClass);
          }
          this.element.setAttribute('aria-invalid', 'true');
          return false;
        }
      }
    }

    messageStore.delete(this.element);
    this.element.classList.remove(invalidClass);
    this.element.classList.remove(userInvalidClass);
    this.element.classList.remove(outOfRangeClass);
    this.element.classList.add(validClass);
    this.element.classList.add(inRangeClass);
    if (this.element.value !== this.element.defaultValue) {
      this.element.classList.add(userValidClass);
    } else {
      this.element.classList.remove(userValidClass);
    }
    this.element.setAttribute('aria-invalid', 'false');
    return true;
  },
  set: undefined,
});

/**
 * mark the validity prototype, because that is what the client-facing
 * code deals with mostly, not the property descriptor thing */
mark(ValidityStatePrototype);

export default ValidityState;
