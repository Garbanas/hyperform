import test from 'ava';
import messageStore from '../../../src/components/messageStore';

test('message_store', (t) => {
  const msg = new String('hello from the tests');
  const el = document.createElement('input');

  el._original_setCustomValidity = function (_msg) {
    el._original_validationMessage = _msg;
  };

  // test chaining
  t.is(messageStore.set(el, msg), messageStore);
  t.true(msg.__hyperform);

  t.is(messageStore.get(el), msg);
  t.true(messageStore.delete(el));
  t.is(messageStore.get(el).toString(), '');

  messageStore.set(el, msg.toString());
  t.is(messageStore.get(el).toString(), msg.toString());
  t.is(el._original_validationMessage, msg.toString());
});
