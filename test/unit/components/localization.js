import test from 'ava';
import { addTranslation, setLanguage, default as _ } from '../../../src/components/localization';

test('localization', (t) => {
  setLanguage('fi');

  const canary = 'Never translate this string! #+*~';

  // return string unchanged
  t.is(_(canary), canary);

  addTranslation('fi', { '#__testing__': canary + canary });

  // return base string still unchanged, but
  t.is(_(canary), canary);
  // translate the testing string
  t.is(_('#__testing__'), canary + canary);

  setLanguage('fi-ZH');
  // return the base lang translation, if it exists
  t.is(_('#__testing__'), canary + canary);

  setLanguage('bar');
  // return the testing string after switching language
  t.is(_('#__testing__'), '#__testing__');

  addTranslation('en', { '#__testing__': canary + canary + canary });
  // return the english default, when it exists
  t.is(_('#__testing__'), canary + canary + canary);
});
