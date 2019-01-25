import fs from 'fs';
import itunes from "itunes-data";

interface LibraryData {
  tracks: {
    [id: number]: string,
  },
  albums: {

  }
}

export class Library {
  data: any;

  constructor() {
    this.data = {
      tracks: {},
      playlists: {},
    };
  }

  addTrack(track: any) {
    const newTrack = {
      id: String(track['Track ID']),
      name: track.Name,
      location: track.Location,
    };
    const { tracks } = this.data;
    tracks[newTrack.id] = newTrack;
  }
  getTracks() {
    const { tracks } = this.data;
    return Object.keys(tracks).map(key => tracks[key]);
  }

  addPlaylist(playlist: any) {
    const items = playlist['Playlist Items'];
    if (!(items || []).length) {
      return;
    }

    const newPlaylist = {
      id: String(playlist['Playlist ID']),
      name: playlist['Name'],
      trackIds: items.map(pi => String(pi['Track ID'])),
    }

    const { playlists } = this.data;
    playlists[newPlaylist.id] = newPlaylist;
  }
  getPlaylists(filter?: Array<string>) {
    const { tracks, playlists } = this.data;
    return Object.keys(playlists)
      .map(key => playlists[key])
      .filter(playlist => filter ? filter.includes(playlist.name) : true)
      .map(playlist => ({
        ...playlist,
        tracks: playlist.trackIds.map(id => tracks[id]),
      }));
  }

}

export class LibraryLoader {
  dataPromise: Promise<Library>;

  constructor(stream: fs.ReadStream) {
    const data = new Library();
    const parser = this.setupListeners(data);
    this.dataPromise = new Promise((resolve, reject) => {
      stream.on('end', () => {
        resolve(data);
      });
      stream.pipe(parser);
    });
  }
  setupListeners(library: Library) {
    const parser = itunes.parser();

    parser.on("track", function (track) {
      // console.log("track:", track);
      library.addTrack(track);
    });

    parser.on("playlist", function (playlist) {
      // console.log("playlist:", playlist);
      library.addPlaylist(playlist);
    });

    return parser;
  }

  static async fromFile(source: string): Promise<Library> {
    const stream = fs.createReadStream(source);
    return new LibraryLoader(stream).dataPromise;
  }
}
