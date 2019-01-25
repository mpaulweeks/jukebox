export default class Library {
    data: any;
    constructor(parsedXml: any);
    static fromFile(source: string): Promise<Library>;
}
