import { CollectionData, SongData } from 'jukebox-utils/src';
import { UrlList } from 'jukebox-utils/src/types';
export declare class CollectionLoader {
    data: CollectionData;
    constructor(existingCollection: CollectionData);
    contains(songUrl: any): boolean;
    merge(songData: SongData): void;
    mergeMany(songDatas: Array<SongData>): void;
    static fromUrlList(urlList: UrlList, existing: CollectionData): Promise<CollectionLoader>;
}
