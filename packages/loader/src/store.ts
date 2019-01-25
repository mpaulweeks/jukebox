import AWS from 'aws-sdk';
import fs from 'fs';

export default class Store {
  s3: AWS.S3;
  baseConfig: any;

  constructor() {
    const json = fs.readFileSync('../../temp/env.json', 'utf8');
    const envData = JSON.parse(json);
    process.env.AWS_ACCESS_KEY_ID = envData.AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = envData.AWS_SECRET_ACCESS_KEY;

    this.s3 = new AWS.S3();
    this.baseConfig = {
      Bucket: 'mpaulweeks-jukebox',
    }
  }
  uploadData(filename: string, data: any) {
    // https://s3.amazonaws.com/mpaulweeks-jukebox/audio/12345
    const key = 'data/' + filename;
    return new Promise((resolve, reject) => {
      this.s3.putObject({
        ...this.baseConfig,
        Key: key,
        Body: JSON.stringify(data, null, 2),
      }, (error, data) => {
        if (error != null) {
          console.log('Failed to put an object: ' + error);
          reject(error);
        } else {
          resolve(key);
        }
      });
    });
  }
  uploadAudio(id: string, location: string) {
    // https://s3.amazonaws.com/mpaulweeks-jukebox/audio/12345
    const key = 'audio/' + id;
    return new Promise((resolve, reject) => {
      fs.readFile(location, (err, buffer) => {
        this.s3.putObject({
          ...this.baseConfig,
          Key: key,
          Body: buffer,
        }, (error, data) => {
          if (error != null) {
            console.log('Failed to put an object: ' + error);
            reject(error);
          } else {
            resolve(key);
          }
        });
      })
    });
  }
}
