import { CollectionData, TrackData } from 'jukebox-utils/src';
import { UrlList } from 'jukebox-utils/src/types';
export declare class CollectionLoader {
    data: CollectionData;
    constructor(existingCollection: CollectionData);
    contains(songUrl: any): boolean;
    merge(trackData: TrackData): void;
    mergeMany(trackDatas: Array<TrackData>): void;
    static fromUrlList(urlList: UrlList, existing: CollectionData): Promise<CollectionLoader>;
}
