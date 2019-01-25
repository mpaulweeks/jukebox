import NodeID3 from 'node-id3';

export interface MetaData {
  album: string,
  artist: string,
  title: string,
  year: string,
  imageSrc: string,
}

export class MetaDataLoader {
  data: MetaData;

  constructor(arrayBuffer: ArrayBuffer) {
    const data = Buffer.from(arrayBuffer);
    const tags = NodeID3.read(data);
    // console.log(tags);

    const imageBuffer = tags.image.imageBuffer;
    const imageSrc = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');

    this.data = {
      album: tags.album,
      artist: tags.artist,
      title: tags.title,
      year: tags.year,
      imageSrc: imageSrc,
    };
  }

  static async fromUrl(source: string): Promise<MetaData> {
    const resp = await fetch(source);
    const arrayBuffer = await resp.arrayBuffer();
    return new MetaDataLoader(arrayBuffer).data;
  }
}
