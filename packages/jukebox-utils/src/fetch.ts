import { Collection } from './collection';
import { Constants } from './constants';
import { InfoLookup } from './infoLookup';
import { DataLoaderWithDefault } from './types';

const bustCache = (url: string): string => `${url}?v=${new Date().getTime()}`;

const fetchData = async <Data, Loader>(
  ClassRef: DataLoaderWithDefault<Data, Loader>,
  fileName: string,
): Promise<Loader> => {
  try {
    const resp = await fetch(bustCache(`${Constants.DataPath}/${fileName}`));
    const jsonObj = await resp.json();
    return new ClassRef(jsonObj);
  } catch (error) {
    return ClassRef.default();
  }
};

export const fetchCollection = async (): Promise<Collection> => {
  return fetchData(Collection, Constants.CollectionFileName);
};

export const fetchInfoLookup = async (): Promise<InfoLookup> => {
  return fetchData(InfoLookup, Constants.InfoLookupFileName);
};
