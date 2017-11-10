import messageStore from './messageStore';
import { getWrapper } from './wrapper';
import generateId from '../tools/generateId';


const warningsCache = new WeakMap();


const DefaultRenderer = {

  /**
   * called when a warning should become visible
   */
  attachWarning(warning, element) {
    /* should also work, if element is last,
     * http://stackoverflow.com/a/4793630/113195 */
    element.parentNode.insertBefore(warning, element.nextSibling);
  },

  /**
   * called when a warning should vanish
   */
  detachWarning(warning, element) {
    warning.parentNode.removeChild(warning);
  },

  /**
   * called when feedback to an element's state should be handled
   *
   * i.e., showing and hiding warnings
   */
  showWarning(element, subRadio = false) {
    const msg = messageStore.get(element).toString();
    let warning = warningsCache.get(element);

    if (msg) {
      if (!warning) {
        const wrapper = getWrapper(element);
        warning = document.createElement('div');
        warning.className = (wrapper && wrapper.settings.classes.warning) || 'hf-warning';
        warning.id = generateId();
        warning.setAttribute('aria-live', 'polite');
        warningsCache.set(element, warning);
      }

      element.setAttribute('aria-errormessage', warning.id);
      if (!element.hasAttribute('aria-describedby')) {
        element.setAttribute('aria-describedby', warning.id);
      }
      warning.textContent = msg;
      Renderer.attachWarning(warning, element);
    } else if (warning && warning.parentNode) {
      if (element.getAttribute('aria-describedby') === warning.id) {
        element.removeAttribute('aria-describedby');
      }
      element.removeAttribute('aria-errormessage');
      Renderer.detachWarning(warning, element);
    }

    if (!subRadio && element.type === 'radio' && element.form) {
      /* render warnings for all other same-name radios, too */
      Array.prototype.filter
        .call(
          document.getElementsByName(element.name),
          radio => radio.name === element.name &&
                   radio.form === element.form,
        )
        .map(radio => Renderer.showWarning(radio, 'sub_radio'));
    }
  },

};


const Renderer = {

  attachWarning: DefaultRenderer.attachWarning,
  detachWarning: DefaultRenderer.detachWarning,
  showWarning: DefaultRenderer.showWarning,

  set(renderer, action) {
    if (!action) {
      action = DefaultRenderer[renderer];
    }
    Renderer[renderer] = action;
  },

};


export default Renderer;
