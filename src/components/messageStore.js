/* eslint-disable no-new-wrappers */
import { getWrapper } from './wrapper';
import mark from '../tools/mark';


/**
 * the internal storage for messages
 */
const store = new WeakMap();


const messageStore = {

  set(element, message, isCustom = false) {
    if (element instanceof window.HTMLFieldSetElement) {
      const wrappedForm = getWrapper(element);
      if (wrappedForm && !wrappedForm.settings.extendFieldset) {
        /* make this a no-op for <fieldset> in strict mode */
        return messageStore;
      }
    }

    if (typeof message === 'string') {
      // @TODO Use custom object!
      message = new String(message);
    }
    if (isCustom) {
      message.is_custom = true;
    }
    mark(message);
    store.set(element, message);

    /* allow the :invalid selector to match */
    if ('_original_setCustomValidity' in element) {
      element._original_setCustomValidity(message.toString());
    }

    return messageStore;
  },

  get(element) {
    let message = store.get(element);
    if (message === undefined && ('_original_validationMessage' in element)) {
      /* get the browser's validation message, if we have none. Maybe it
       * knows more than we. */
      message = new String(element._original_validationMessage);
    }
    return message ? message : new String('');
  },

  delete(element) {
    if ('_original_setCustomValidity' in element) {
      element._original_setCustomValidity('');
    }
    return store.delete(element);
  },

};

export default messageStore;
