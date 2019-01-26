import { Collection } from "./collection";
import Constants from "./constants";
import { InfoLookup } from "./infoLookup";

export const fetchCollection = (): Promise<Collection> => {
  return Collection.fromUrl(`${Constants.DataRootPath}/${Constants.CollectionFileName}`);
}

export const fetchInfoLookup = (): Promise<InfoLookup> => {
  return InfoLookup.fromUrl(`${Constants.DataRootPath}/${Constants.InfoLookupFileName}`);
}
