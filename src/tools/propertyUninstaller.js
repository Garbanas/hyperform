import { getWrapper } from '../components/wrapper';


/**
 * remove `property` from element and restore _original_property, if present
 */
export default function (element, property) {
  try {
    delete element[property];
  } catch (e) {
    /* Safari <= 9 and PhantomJS will end up here :-( Nothing to do except
     * warning */
    const wrapper = getWrapper(element);
    if (wrapper && wrapper.settings.debug) {
      /* global console */
      console.log(`[hyperform] cannot uninstall custom property ${property}`);
    }
    return false;
  }

  const originalDescriptor = Object.getOwnPropertyDescriptor(element, `_original_${property}`);

  if (originalDescriptor) {
    Object.defineProperty(element, property, originalDescriptor);
  }

  return true;
}
