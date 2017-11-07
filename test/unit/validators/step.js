import test from 'ava';
import step from '../../../src/validators/step';

test('validator-step', (t) => {
  const el = document.createElement('input');
  el.type = 'number';
  el.setAttribute('step', '10');
  el.value = '';
  t.is(step(el), true);
  el.value = '10';
  t.is(step(el), true);
  el.value = '1';
  t.is(step(el), false);
  el.value = '0';
  t.is(step(el), true);
  el.value = '-11';
  t.is(step(el), false);
  el.value = '10.00001';
  t.is(step(el), false);
  el.value = '1e14';
  t.is(step(el), true);
});

test('validator-step for month', (t) => {
  const el = document.createElement('input');
  el.type = 'month';
  el.setAttribute('step', '2');
  el.setAttribute('min', '2015-01');
  el.value = '';
  t.is(step(el), true);
  el.value = '2015-01';
  t.is(step(el), true);
  el.value = '0000-00';
  t.is(step(el), false);
  el.value = '2014-13';
  t.is(step(el), true);
  el.value = '2015-02';
  t.is(step(el), false);
  el.value = '2015-11';
  t.is(step(el), true);
  el.setAttribute('step', '31');
  t.is(step(el), false);
  el.value = '2017-08';
  t.is(step(el), true);
  el.value = '2017-09';
  t.is(step(el), false);
  el.value = '2012-06';
  t.is(step(el), true);
});
