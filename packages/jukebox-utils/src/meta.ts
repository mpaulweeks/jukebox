import fs from 'fs';
import NodeID3 from 'node-id3';
import { MetaData } from './types';

export class MetaLoader {
  data: MetaData;

  constructor(buffer: Buffer) {
    const tags = NodeID3.read(buffer);

    // console.log(tags);

    let imageSrc = '';
    if (tags.image) {
      const imageBuffer = tags.image.imageBuffer;
      imageSrc = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
    } else {
      console.log('meta failure:', tags);
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

  static async fromFile(source: string): Promise<MetaData> {
    source = source.replace('file:///', '/');
    source = decodeURI(source);
    console.log('reading meta for:', source);
    return new Promise((resolve, reject) => {
      fs.readFile(source, (err, buffer) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(new MetaLoader(buffer).data);
        }
      });
    })
  }
}
