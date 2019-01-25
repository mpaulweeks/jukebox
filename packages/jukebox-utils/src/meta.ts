import fs from 'fs';
import NodeID3 from 'node-id3';
import { MetaData } from './types';

export class MetaLoader {
  data: MetaData;

  constructor(buffer: Buffer) {
    const tags = NodeID3.read(buffer);

    let imageSrc = '';
    if (tags.image) {
      const imageBuffer = tags.image.imageBuffer;
      imageSrc = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
    } else {
      console.log('unrecognized meta:', tags);
    }

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

  static async fromFile(path: string): Promise<MetaData> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, buffer) => {
        if (err) {
          console.log('error reading meta:', err);
          reject(err);
        } else {
          resolve(new MetaLoader(buffer).data);
        }
      });
    })
  }
}
