import fs from 'fs';
import NodeID3 from 'node-id3';
import { MetaData } from './types';

export class MetaLoader {
  data: MetaData;

  constructor(buffer: Buffer) {
    const tags = NodeID3.read(buffer);
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
    const buffer = Buffer.from(arrayBuffer);
    return new MetaLoader(buffer).data;
  }

  static async fromFile(source: string): Promise<MetaData> {
    return new Promise((resolve, reject) => {
      fs.readFile(source, (err, buffer) => {
        resolve(new MetaLoader(buffer).data);
      });
    })
  }
}
