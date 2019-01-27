import fs from 'fs';
import jsmediatags from 'jsmediatags';
import NodeID3 from 'node-id3';
import { MetaData } from './types';

export class MetaLoader {

  static imageFromArray(format, dataString) {
    return `data:${format};base64,${dataString}`;
  }
  static tryParseNodeId3(buffer: Buffer): Promise<MetaData> {
    return new Promise((resolve, reject) => {
      const tags = NodeID3.read(buffer);
      console.log(tags);

      if (tags.image) {
        const imageFormat = tags.image.mime;
        const imageData = tags.image.imageBuffer.toString('base64');
        resolve({
          album: tags.album,
          artist: tags.artist,
          title: tags.title,
          year: tags.year,
          imageSrc: this.imageFromArray(imageFormat, imageData),
        });
      } else {
        console.log('node-id3 error:', tags);
        reject();
      }
    });
  }

  static tryParseJsMediaTags(buffer: Buffer): Promise<MetaData> {
    return new Promise<MetaData>((resolve, reject) => {
      jsmediatags.read(buffer, {
        onSuccess: data => {
          if (data.tags.picture) {
            console.log('jsmediatags:', data);
            // const imageFormat = data.tags.picture.format;
            const imageFormat = 'image/jpeg';
            const imageData = btoa(data.tags.picture.data.map(char => String.fromCharCode(char)));
            resolve({
              album: data.tags.album,
              artist: data.tags.artist,
              title: data.tags.title,
              year: data.tags.year,
              imageSrc: this.imageFromArray(imageFormat, imageData),
            });
          } else {
            reject('no picture data');
          }
        },
        onError: error => {
          console.log('jsmediatags error:', error);
          reject(error);
        },
      });
    });
  }

  static parseBuffer(buffer: Buffer): Promise<MetaData> {
    return this.tryParseNodeId3(buffer)
      .catch(() => this.tryParseJsMediaTags(buffer))
      .catch(() => ({
        album: 'Unknown Album',
        artist: 'Unknown Artist',
        title: 'Unknown Title',
        year: '????',
        imageSrc: undefined,
      }));
  }

  static async fromUrl(source: string): Promise<MetaData> {
    const resp = await fetch(source);
    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return this.parseBuffer(buffer);
  }

  static async fromFile(path: string): Promise<MetaData> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, buffer) => {
        if (err) {
          // console.log('error reading meta:', err);
          reject(err);
        } else {
          const dataPromise = this.parseBuffer(buffer);
          resolve(dataPromise);
        }
      });
    })
  }
}
