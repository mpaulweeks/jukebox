import fs from 'fs';
import jsmediatags from 'jsmediatags';
import NodeID3 from 'node-id3';
import { Logger } from './logger';
import { MetaData } from './types';

export class MetaLoader {

  static dataUrl(metaData: MetaData) {
    const { imageFormat, imageBuffer } = metaData;
    if (!imageFormat || !imageBuffer) {
      return null;
    }
    return `data:image/${imageFormat};base64,${imageBuffer.toString('base64')}`;
  }

  static tryParseNodeId3(buffer: Buffer): Promise<MetaData> {
    return new Promise((resolve, reject) => {
      const tags = NodeID3.read(buffer);
      Logger.debug('node-id3:', tags);

      if (tags.image) {
        resolve({
          album: tags.album,
          artist: tags.artist,
          title: tags.title,
          year: tags.year,
          duration: 0,
          trackNumber: String(tags.trackNumber),
          imageFormat: tags.image.mime,
          imageBuffer: tags.image.imageBuffer,
        });
      } else {
        Logger.debug('node-id3 error:', tags);
        reject();
      }
    });
  }

  static tryParseJsMediaTags(buffer: Buffer): Promise<MetaData> {
    return new Promise<MetaData>((resolve, reject) => {
      jsmediatags.read(buffer, {
        onSuccess: data => {
          const { tags } = data;
          Logger.debug('jsmediatags:', tags);
          let imageBuffer: (Buffer | undefined);
          if (tags.picture) {
            const imageStr = tags.picture.data.map(char => String.fromCharCode(char)).join('');
            imageBuffer = Buffer.from(imageStr, 'binary');
          }
          resolve({
            album: tags.album,
            artist: tags.artist,
            title: tags.title,
            year: tags.year,
            duration: 0,
            trackNumber: String(tags.track),
            imageFormat: tags.picture && tags.picture.format,
            imageBuffer: imageBuffer,
          });
        },
        onError: error => {
          Logger.debug('jsmediatags error:', error);
          reject(error);
        },
      });
    });
  }

  static async fromBuffer(buffer: Buffer, mediaStream?: MediaStream): Promise<MetaData> {
    const metaData = await (
      this.tryParseNodeId3(buffer)
        .catch(() => this.tryParseJsMediaTags(buffer))
        .catch(() => ({
          album: 'Unknown Album',
          artist: 'Unknown Artist',
          title: 'Unknown Title',
          year: '????',
          duration: 0,
          trackNumber: undefined,
          imageSrc: undefined,
        }))
    );
    return new Promise((resolve, reject) => {
      if (mediaStream) {
        const audioElm = new Audio();
        audioElm.addEventListener('load', () => {
          metaData.duration = audioElm.duration;
          resolve(metaData);
        });
        audioElm.srcObject = mediaStream;
      } else {
        // todo get mediaStream from buffer
        resolve(metaData);
      }
    })
  }

  static async fromUrl(source: string): Promise<MetaData> {
    const resp = await fetch(source);
    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return this.fromBuffer(buffer);
  }

  static async fromFile(path: string): Promise<MetaData> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, buffer) => {
        if (err) {
          Logger.debug('error reading meta:', err);
          reject(err);
        } else {
          const dataPromise = this.fromBuffer(buffer);
          resolve(dataPromise);
        }
      });
    })
  }
}
