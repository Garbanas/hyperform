import test from 'ava';
import willValidate from '../../../src/polyfills/willValidate';

test('willValidate', (t) => {
  const input = document.createElement('input');
  input.type = 'hidden';
  t.false(willValidate(input));
  input.type = 'text';
  t.true(willValidate(input));
  const select = document.createElement('select');
  t.true(willValidate(select));
});
