import AWS from 'aws-sdk';
import fs from 'fs';
import { Collection, Constants, fetchCollection, fetchInfoLookup, InfoLookup, Logger } from 'jukebox-utils';

export class Store {
  s3: AWS.S3;
  bucket = 'mpaulweeks-jukebox';

  constructor() {
    const json = fs.readFileSync('../../local/env.json', 'utf8');
    const envData = JSON.parse(json);
    process.env.AWS_ACCESS_KEY_ID = envData.AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = envData.AWS_SECRET_ACCESS_KEY;

    this.s3 = new AWS.S3();
  }

  downloadCollection(): Promise<Collection> {
    if (Constants.isDev) {
      return new Promise((resolve, reject) => {
        try {
          const path = `${Constants.LocalDataRoot}/${Constants.DataLocalPath}/${Constants.CollectionFileName}`;
          const jsonStr = fs.readFileSync(path, 'utf8');
          resolve(new Collection(JSON.parse(jsonStr)));
        } catch (err) {
          resolve(Collection.default());
        }
      });
    } else {
      return fetchCollection();
    }
  }

  downloadInfoLookup(): Promise<InfoLookup> {
    if (Constants.isDev) {
      return new Promise((resolve, reject) => {
        try {
          const path = `${Constants.LocalDataRoot}/${Constants.DataLocalPath}/${Constants.InfoLookupFileName}`;
          const jsonStr = fs.readFileSync(path, 'utf8');
          resolve(new InfoLookup(JSON.parse(jsonStr)));
        } catch (err) {
          resolve(InfoLookup.default());
        }
      });
    } else {
      return fetchInfoLookup();
    }
  }

  upload(config: AWS.S3.PutObjectRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      if (Constants.isDev) {
        fs.writeFile(`${Constants.LocalDataRoot}/${config.Key}`, config.Body, error => {
          if (error) {
            Logger.log('Failed to save locally: ' + error);
            reject(error);
          } else {
            Logger.log('saved locally: ', config.Key);
            resolve(config.Key);
          }
        })
      } else {
        this.s3.putObject(config, (error, data) => {
          if (error != null) {
            Logger.log('Failed to put an object: ' + error);
            reject(error);
          } else {
            Logger.log('uploaded: ', config.Key);
            resolve(config.Key);
          }
        });
      }
    });
  }

  uploadData(filename: string, data: any) {
    // eg: https://s3.amazonaws.com/mpaulweeks-jukebox/data/collection.json
    return this.upload({
      Bucket: this.bucket,
      Key: `${Constants.DataLocalPath}/${filename}`,
      Body: JSON.stringify(data, null, 2),
    });
  }

  uploadAudio(id: string, location: string) {
    // eg: https://s3.amazonaws.com/mpaulweeks-jukebox/audio/12345
    return new Promise((resolve, reject) => {
      fs.readFile(location, (err, buffer) => {
        const promise = this.upload({
          Bucket: this.bucket,
          Key: `${Constants.AudioLocalPath}/${id}`,
          Body: buffer,
        });
        resolve(promise);
      });
    });
  }

  uploadImage(hash: string, buffer: Buffer) {
    // eg: https://s3.amazonaws.com/mpaulweeks-jukebox/image/12345
    return this.upload({
      Bucket: this.bucket,
      Key: `${Constants.ImageLocalPath}/${hash}`,
      Body: buffer,
    });
  }
}
