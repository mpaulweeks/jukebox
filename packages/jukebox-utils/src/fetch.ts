import { Collection } from "./collection";
import { Constants } from "./constants";
import { InfoLookup } from "./infoLookup";

const bustCache = (url: string): string => `${url}?v=${new Date().getTime()}`;

export const fetchCollection = (): Promise<Collection> => {
  return Collection
    .fromUrl(bustCache(Constants.CollectionPath))
    .catch(err => Collection.default());
}

export const fetchInfoLookup = (): Promise<InfoLookup> => {
  return InfoLookup
    .fromUrl(bustCache(Constants.InfoLookupPath))
    .catch(err => InfoLookup.default());
}
