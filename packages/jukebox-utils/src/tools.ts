export function calcTimestamp(date: Date) {
  const YYYY = String(date.getFullYear()).padStart(4, '0');
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const dd = String(date.getSeconds()).padStart(2, '0');
  return `${YYYY}${MM}${DD}${hh}${mm}${dd}`;
}

export function range(length: number): number[] {
  const toReturn: number[] = [];
  for (let i = 0; i < length; i++) {
    toReturn.push(i);
  }
  return toReturn;
}

export async function asyncMap<E, T>(
  array: E[],
  callback: (elm: E, index: number, array: E[]) => Promise<T>,
): Promise<T[]> {
  // https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
  const output: T[] = [];
  for (let index = 0; index < array.length; index++) {
    const result = await callback(array[index], index, array);
    output.push(result);
  }
  return output;
}

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

export function truncate(str: string, limit: number) {
  str = str || '';
  if (str.length < limit) {
    return str;
  }
  return str.substring(0, limit - 4) + ' ...';
}
