import { getWrapper } from '../components/wrapper';


/**
 * add `property` to an element
 *
 * js> installer(element, 'foo', { value: 'bar' });
 * js> assert(element.foo === 'bar');
 */
export default function (element, property, descriptor) {
  descriptor.configurable = true;
  descriptor.enumerable = true;
  if ('value' in descriptor) {
    descriptor.writable = true;
  }

  const originalDescriptor = Object.getOwnPropertyDescriptor(element, property);

  if (originalDescriptor) {
    if (originalDescriptor.configurable === false) {
      /* Safari <= 9 and PhantomJS will end up here :-( Nothing to do except
       * warning */
      const wrapper = getWrapper(element);
      if (wrapper && wrapper.settings.debug) {
        /* global console */
        console.log(`[hyperform] cannot install custom property ${property}`);
      }
      return false;
    }

    /* we already installed that property... */
    if (
      (originalDescriptor.get && originalDescriptor.get.__hyperform) ||
      (originalDescriptor.value && originalDescriptor.value.__hyperform)
    ) {
      return false;
    }

    /* publish existing property under new name, if it's not from us */
    Object.defineProperty(element, `_original_${property}`, originalDescriptor);
  }

  delete element[property];
  Object.defineProperty(element, property, descriptor);

  return true;
}
