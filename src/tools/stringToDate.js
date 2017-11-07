import getDateFromWeek from './getDateFromWeek';


/**
 * calculate a date from a string according to HTML5
 */
export default function (string, elementType) {
  const date = new Date(0);
  let ms;
  switch (elementType) {
    case 'datetime':
      if (!/^([0-9]{4,})-([0-9]{2})-([0-9]{2})T([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(string)) {
        return null;
      }
      ms = RegExp.$7 || '000';
      while (ms.length < 3) {
        ms += '0';
      }
      date.setUTCFullYear(Number(RegExp.$1));
      date.setUTCMonth(Number(RegExp.$2) - 1, Number(RegExp.$3));
      date.setUTCHours(Number(RegExp.$4), Number(RegExp.$5), Number(RegExp.$6 || 0), Number(ms));
      return date;

    case 'date':
      if (!/^([0-9]{4,})-([0-9]{2})-([0-9]{2})$/.test(string)) {
        return null;
      }
      date.setUTCFullYear(Number(RegExp.$1));
      date.setUTCMonth(Number(RegExp.$2) - 1, Number(RegExp.$3));
      return date;

    case 'month':
      if (!/^([0-9]{4,})-([0-9]{2})$/.test(string)) {
        return null;
      }
      date.setUTCFullYear(Number(RegExp.$1));
      date.setUTCMonth(Number(RegExp.$2) - 1, 1);
      return date;

    case 'week':
      if (!/^([0-9]{4,})-W(0[1-9]|[1234][0-9]|5[0-3])$/.test(string)) {
        return null;
      }
      return getDateFromWeek(Number(RegExp.$2), Number(RegExp.$1));

    case 'time':
      if (!/^([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(string)) {
        return null;
      }
      ms = RegExp.$4 || '000';
      while (ms.length < 3) {
        ms += '0';
      }
      date.setUTCHours(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3 || 0), Number(ms));
      return date;

    default:
      return null;
  }
}
