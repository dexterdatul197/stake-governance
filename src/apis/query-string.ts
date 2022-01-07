import qs from 'query-string';

export const qsStringify = <T>(object: T): string => {
  return `?${qs.stringify(object, {
    skipNull: true,
    skipEmptyString: true
  })}`;
};
