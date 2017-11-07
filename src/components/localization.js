/**
 * the following validation messages are from Firefox source,
 * http://mxr.mozilla.org/mozilla-central/source/dom/locales/en-US/chrome/dom/dom.properties
 * released under MPL license, http://mozilla.org/MPL/2.0/.
 */
const catalog = {
  en: {
    TextTooLong: 'Please shorten this text to %l characters or less (you are currently using %l characters).',
    ValueMissing: 'Please fill out this field.',
    CheckboxMissing: 'Please check this box if you want to proceed.',
    RadioMissing: 'Please select one of these options.',
    FileMissing: 'Please select a file.',
    SelectMissing: 'Please select an item in the list.',
    InvalidEmail: 'Please enter an email address.',
    InvalidURL: 'Please enter a URL.',
    PatternMismatch: 'Please match the requested format.',
    PatternMismatchWithTitle: 'Please match the requested format: %l.',
    NumberRangeOverflow: 'Please select a value that is no more than %l.',
    DateRangeOverflow: 'Please select a value that is no later than %l.',
    TimeRangeOverflow: 'Please select a value that is no later than %l.',
    NumberRangeUnderflow: 'Please select a value that is no less than %l.',
    DateRangeUnderflow: 'Please select a value that is no earlier than %l.',
    TimeRangeUnderflow: 'Please select a value that is no earlier than %l.',
    StepMismatch: 'Please select a valid value. The two nearest valid values are %l and %l.',
    StepMismatchOneValue: 'Please select a valid value. The nearest valid value is %l.',
    BadInputNumber: 'Please enter a number.',
  },
};


/**
 * the global language Hyperform will use
 */
let language = 'en';


/**
 * the base language according to BCP47, i.e., only the piece before the first hyphen
 */
let baseLanguage = 'en';


/**
 * set the language for Hyperform’s messages
 */
export function setLanguage(newlang) {
  language = newlang;
  baseLanguage = newlang.replace(/[-_].*/, '');
}


/**
 * add a lookup catalog "string: translation" for a language
 */
export function addTranslation(lang, newCatalog) {
  if (!(lang in catalog)) {
    catalog[lang] = {};
  }
  for (const key in newCatalog) {
    if (newCatalog.hasOwnProperty(key)) {
      catalog[lang][key] = newCatalog[key];
    }
  }
}


/**
 * return `key` translated into the current language
 *
 * Defaults to the base language and then English if the former has no
 * translation for `key`.
 */
export default function (key) {
  if ((language in catalog) && (key in catalog[language])) {
    return catalog[language][key];
  } else if ((baseLanguage in catalog) && (key in catalog[baseLanguage])) {
    return catalog[baseLanguage][key];
  } else if (key in catalog.en) {
    return catalog.en[key];
  }
  return key;
}
