import { MetaData } from 'jukebox-utils/src';

interface Item extends MetaData {
  updated: Date,
};

export interface Collection {
  [source: string]: Item,
}

export class CollectionLoader {
  data: Collection;

  constructor(existingCollection: Collection) {
    this.data = existingCollection;
  }
  merge(metaData: MetaData) {
    this.data = {
      ...this.data,
      [metaData.source]: {
        ...metaData,
        updated: new Date(),
      },
    };
  }
  mergeMany(metaDatas: Array<MetaData>) {
    metaDatas.forEach(md => this.merge(md));
  }
}
