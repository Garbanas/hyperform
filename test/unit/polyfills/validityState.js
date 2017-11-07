import test from 'ava';
import ValidityState from '../../../src/polyfills/validityState';
import CustomValidatorRegistry from '../../../src/components/registry';

test('ValidityState customError non-bool response', (t) => {
  const input = document.createElement('input');
  CustomValidatorRegistry.set(input, () => 'a');
  t.false(ValidityState(input).customError);
  CustomValidatorRegistry.delete(input);
  CustomValidatorRegistry.set(input, () => 1);
  t.false(ValidityState(input).customError);
  CustomValidatorRegistry.delete(input);
  CustomValidatorRegistry.set(input, () => 0);
  t.true(ValidityState(input).customError);
});

test('ValidityState rangeOverflow', (t) => {
  const input = document.createElement('input');

  input.value = 5;
  t.false(ValidityState(input).rangeOverflow);

  input.type = 'number';
  input.max = 2;
  t.true(ValidityState(input).rangeOverflow);

  input.value = 2;
  t.false(ValidityState(input).rangeOverflow);

  input.max = 1;
  t.true(ValidityState(input).rangeOverflow);

  input.value = '';
  t.false(ValidityState(input).rangeOverflow);
});

test('ValidityState patternMismatch', (t) => {
  const input = document.createElement('input');
  t.false(ValidityState(input).patternMismatch);

  input.pattern = 'X';
  input.value = 'Y';
  t.true(ValidityState(input).patternMismatch);

  input.value = '';
  t.false(ValidityState(input).patternMismatch);

  input.value = 'X';
  t.false(ValidityState(input).patternMismatch);

  input.value = 'XA';
  t.true(ValidityState(input).patternMismatch);
});
