import { DATE_TYPES } from '../constants/date';

const getDate = <T>(date: Date, type: string, locale = 'de'): T => {
  switch (type) {
    case DATE_TYPES.year:
      return Number(
        new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(new Date()),
      ) as unknown as T;

    case DATE_TYPES.monthNumber:
      if (typeof (1 as unknown as T) === 'number') {
        return date.getMonth() as unknown as T;
      }
      break;

    case DATE_TYPES.longName:
      return date.toLocaleString(locale, { month: 'long' }) as unknown as T;
  }

  return null as unknown as T;
};

export { getDate };
