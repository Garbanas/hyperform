import test from 'ava';
import CustomValidatorRegistry from '../../../src/components/registry';

function get(attributes) {
  const el = document.createElement('input');
  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
    if (key === 'value') {
      el[key] = attributes[key];
    }
  }
  return el;
}

test('registry', (t) => {
  let secondCalled = false;
  const el = get([]);
  const validator1 = function (element) {};
  const validator2 = function (element) { secondCalled = true; };

  t.true(Array.isArray(CustomValidatorRegistry.get(el)));
  CustomValidatorRegistry.set(el, validator1);
  t.is(CustomValidatorRegistry.get(el)[0], validator1);
  t.is(CustomValidatorRegistry.get(el).length, 1);

  CustomValidatorRegistry.set(el, validator2);
  t.is(CustomValidatorRegistry.get(el)[0], validator1);
  t.is(CustomValidatorRegistry.get(el)[1], validator2);
  t.is(CustomValidatorRegistry.get(el).length, 2);

  /* make sure the functions don't get called underway */
  t.is(secondCalled, false);
});
