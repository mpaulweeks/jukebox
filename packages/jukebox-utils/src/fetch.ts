import { Collection, Constants } from ".";

export const fetchCollection = (): Promise<Collection> => {
  return fetch(`${Constants.DataRootPath}/collection.json`)
    .then(resp => resp.json())
    .then(data => new Collection(data));
}
