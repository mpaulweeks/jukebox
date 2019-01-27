import AWS from 'aws-sdk';
import fs from 'fs';
import { Constants } from 'jukebox-utils';

export default class Store {
  s3: AWS.S3;
  bucket = 'mpaulweeks-jukebox';

  constructor() {
    const json = fs.readFileSync('../../local/env.json', 'utf8');
    const envData = JSON.parse(json);
    process.env.AWS_ACCESS_KEY_ID = envData.AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = envData.AWS_SECRET_ACCESS_KEY;

    this.s3 = new AWS.S3();
  }

  upload(config: AWS.S3.PutObjectRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      if (Constants.isDev) {
        fs.writeFile(`../../local/${config.Key}`, config.Body, error => {
          if (error) {
            console.log('Failed to save locally: ' + error);
            reject(error);
          } else {
            console.log('saved locally: ', config.Key);
            resolve(config.Key);
          }
        })
      } else {
        this.s3.putObject(config, (error, data) => {
          if (error != null) {
            console.log('Failed to put an object: ' + error);
            reject(error);
          } else {
            console.log('uploaded: ', config.Key);
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
      Key: 'data/' + filename,
      Body: JSON.stringify(data, null, 2),
    });
  }

  uploadAudio(id: string, location: string) {
    // eg: https://s3.amazonaws.com/mpaulweeks-jukebox/audio/12345
    return new Promise((resolve, reject) => {
      fs.readFile(location, (err, buffer) => {
        const promise = this.upload({
          Bucket: this.bucket,
          Key: 'audio/' + id,
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
      Key: 'image/' + hash,
      Body: buffer,
    });
  }
}
