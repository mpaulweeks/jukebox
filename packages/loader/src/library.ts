import fs from 'fs';
import xml2js from 'xml2js';

export default class Library {
  data: any;

  constructor(parsedXml: any) {
    this.data = parsedXml;
  }

  static async fromFile(source: string): Promise<Library> {
    return new Promise((resolve, reject) => {
      fs.readFile(source, (fsErr, buffer) => {
        xml2js.parseString(buffer, (xmlErr, result) => {
          console.log(fsErr, xmlErr);
          const library = new Library(result);
          resolve(library);
        });
      });
    })
  }
}
