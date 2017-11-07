import test from 'ava';
import customMessages from '../../../src/components/customMessages';
import ValidityState from '../../../src/polyfills/validityState';
import validationMessage from '../../../src/polyfills/validationMessage';

test('custom_messages', (t) => {
  const msg = 'hello from the tests';
  const el = document.createElement('input');
  el.required = true;

  customMessages.set(el, 'valueMissing', msg);
  t.is(customMessages.get(el, 'valueMissing'), msg);

  t.true(ValidityState(el).valueMissing);
  t.is(validationMessage(el), msg);
});
