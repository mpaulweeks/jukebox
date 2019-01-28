import fs from 'fs';
import itunes from 'itunes-data';

interface iTunesLibraryData {
  tracks: {
    [id: string]: any,
  },
  playlists: {
    [id: string]: any,
  }
};

export class iTunesLibrary {
  data: iTunesLibraryData;

  constructor() {
    this.data = {
      tracks: {},
      playlists: {},
    };
  }

  decodeLocation(location) {
    return location && decodeURI(
      location
        .split('file:///').join('/')
        .split('%3B').join(';')
        .split('%23').join('#')
    )
  }

  addTrack(track: any) {
    const newTrack = {
      id: String(track['Track ID']),
      name: track.Name,
      location: track.Location,
      path: this.decodeLocation(track.Location),
      summary: (track.Album ? `${track.Album} - ` : '') + `${track.Artist} - ${track.Name}`,
    };
    const { tracks } = this.data;
    tracks[newTrack.id] = newTrack;
  }
  getTracks() {
    const { tracks } = this.data;
    return Object.keys(tracks).map(key => tracks[key]);
  }
  getTrack(id) {
    return this.data.tracks[id];
  }

  addPlaylist(playlist: any) {
    const items = playlist['Playlist Items'];
    if (!(items || []).length) {
      return;
    }

    const newPlaylist = {
      id: String(playlist['Playlist ID']),
      name: playlist['Name'],
      // todo 'Persistent ID' lookup
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

export class iTunesLibraryLoader {
  dataPromise: Promise<iTunesLibrary>;

  constructor(stream: fs.ReadStream) {
    const data = new iTunesLibrary();
    const parser = this.setupListeners(data);
    this.dataPromise = new Promise((resolve, reject) => {
      stream.on('end', () => {
        resolve(data);
      });
      stream.pipe(parser);
    });
  }
  setupListeners(library: iTunesLibrary) {
    const parser = itunes.parser();

    parser.on("track", function (track) {
      library.addTrack(track);
    });

    parser.on("playlist", function (playlist) {
      library.addPlaylist(playlist);
    });

    return parser;
  }

  static async fromFile(source: string): Promise<iTunesLibrary> {
    const stream = fs.createReadStream(source);
    return new iTunesLibraryLoader(stream).dataPromise;
  }
}
