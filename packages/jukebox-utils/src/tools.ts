
export function range(length: number): Array<number> {
  const toReturn: Array<number> = [];
  for (let i = 0; i < length; i++) {
    toReturn.push(i);
  }
  return toReturn;
}

export async function asyncMap<E, T>(array: Array<E>, callback: (elm: E, index: number, array: Array<E>) => Promise<T>): Promise<Array<T>> {
  // https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
  const output: Array<T> = [];
  for (let index = 0; index < array.length; index++) {
    const result = await callback(array[index], index, array);
    output.push(result);
  }
  return output;
}
