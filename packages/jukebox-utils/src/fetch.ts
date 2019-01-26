import { Collection } from "./collection";
import Constants from "./constants";
import { InfoLookup } from "./infoLookup";

export const fetchCollection = (): Promise<Collection> => {
  return Collection.fromUrl(Constants.CollectionPath);
}

export const fetchInfoLookup = (): Promise<InfoLookup> => {
  return InfoLookup.fromUrl(Constants.InfoLookupPath);
}

export const getAudioUrl = (trackId) => {
  return `${Constants.AudioRootPath}/${trackId}`;
}
