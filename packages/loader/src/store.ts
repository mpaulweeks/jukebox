import AWS from 'aws-sdk';
import fs from 'fs';
import { asyncMap, Collection, Constants, DataLoaderWithDefault, InfoLookup, Logger } from 'jukebox-utils';
import fetch from 'node-fetch';
import { LoaderConfig } from './config';
import { iTunesLibrary, iTunesLibraryLoader } from './iTunesLibrary';

interface toUploadFile {
  fileName: string,
  location: string,
};

export class Store {
  s3: AWS.S3;
  bucket = 'mpaulweeks-jukebox';

  constructor() {
    this.s3 = new AWS.S3();
  }

  iTunesLibrary(): Promise<iTunesLibrary> {
    return iTunesLibraryLoader.fromFile(LoaderConfig.iTunesLibraryPath);
  }

  private async downloadData<Data, Loader>(ClassRef: DataLoaderWithDefault<Data, Loader>, fileName: string): Promise<Loader> {
    try {
      if (Constants.isDev) {
        const path = `${Constants.LocalDataRoot}/${Constants.DataDirectory}/${fileName}`;
        Logger.log('fetching:', path);
        const jsonStr = fs.readFileSync(path, 'utf8');
        return new ClassRef(JSON.parse(jsonStr));
      } else {
        const resp = await fetch(`${Constants.DataPath}/${fileName}`);
        const jsonObj = await resp.json();
        return new ClassRef(jsonObj);
      }
    } catch (error) {
      return ClassRef.default();
    }
  }

  downloadCollection(): Promise<Collection> {
    return this.downloadData(Collection, Constants.CollectionFileName);
  }

  downloadInfoLookup(): Promise<InfoLookup> {
    return this.downloadData(InfoLookup, Constants.InfoLookupFileName);
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
    const key = `${Constants.DataDirectory}/${filename}`;
    return this.upload({
      Bucket: this.bucket,
      Key: key.split('.min.').join('.'),
      Body: JSON.stringify(data, null, 2),
    }).then(() => this.upload({
      Bucket: this.bucket,
      Key: key,
      Body: JSON.stringify(data),
    }));
  }

  uploadAudio(id: string, location: string): Promise<Buffer> {
    // eg: https://s3.amazonaws.com/mpaulweeks-jukebox/audio/12345
    return new Promise((resolve, reject) => {
      fs.readFile(location, (err, buffer) => {
        this.upload({
          Bucket: this.bucket,
          Key: `${Constants.AudioDirectory}/${id}`,
          Body: buffer,
        }).then(() => resolve(buffer));
      });
    });
  }

  uploadImage(hash: string, buffer: Buffer) {
    // eg: https://s3.amazonaws.com/mpaulweeks-jukebox/image/12345
    return this.upload({
      Bucket: this.bucket,
      Key: `${Constants.ImageDirectory}/${hash}`,
      Body: buffer,
    });
  }

  uploadWeb(filePath: string, location: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(location, (err, buffer) => {
        this.upload({
          Bucket: this.bucket,
          Key: `${Constants.WebDirectory}/${filePath}`,
          Body: buffer,
        }).then(() => resolve(buffer));
      });
    });
  }

  async deployPlayer() {
    interface ExploreDir {
      relativePath: string,
      location: string,
    }
    const toExplore: Array<ExploreDir> = [{
      relativePath: '',
      location: Constants.PlayerBuildPath,
    }];
    const toUpload: Array<toUploadFile> = [];

    while (toExplore.length > 0) {
      const currentDir: ExploreDir = toExplore.pop()!;
      const files = fs.readdirSync(currentDir.location);
      if (!files) {
        continue;
      }
      files.forEach(fileName => {
        const newRelativePath = currentDir.relativePath ? `${currentDir.relativePath}/${fileName}` : fileName;
        const newLocation = `${currentDir.location}/${fileName}`;
        if (fs.lstatSync(newLocation).isDirectory()) {
          toExplore.push({
            relativePath: newRelativePath,
            location: newLocation,
          });
        } else {
          toUpload.push({
            fileName: newRelativePath,
            location: newLocation,
          });
        }
      });
    }

    await asyncMap(toUpload, async fileInfo => {
      const { fileName, location } = fileInfo;
      this.uploadWeb(fileName, location);
      if (fileName.endsWith('.js')) {
        console.log('should re-package:', fileName);
      }
    });
  }
}
