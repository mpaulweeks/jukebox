import fs from 'fs';
import itunes from 'itunes-data';
import { Logger } from 'jukebox-utils';

interface iTunesTrackData {
  itunesId: string,
  name: string,
  location: string,
  path: string,
  summary: string,
  id: string,
};

interface iTunesPlaylistData {
  id: string,
  name: string,
  iTunesIds: Array<string>,
  tracks: Array<iTunesTrackData>,
  trackIds: Array<string>,
}

interface iTunesLibraryData {
  iTunesPlaylists: {
    [id: string]: iTunesPlaylistData,
  },
  iTunesTracks: {
    [id: string]: iTunesTrackData,
  },
  tracks: {
    [id: string]: iTunesTrackData,
  },
};

export class iTunesLibrary {
  data: iTunesLibraryData;
  trackCount = 0;

  constructor() {
    this.data = {
      iTunesTracks: {},
      tracks: {},
      iTunesPlaylists: {},
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
      id: track['Persistent ID'],
      itunesId: String(track['Track ID']),
      name: track.Name,
      location: track.Location,
      path: this.decodeLocation(track.Location),
      summary: (track.Album ? `${track.Album} - ` : '') + `${track.Artist} - ${track.Name}`,
    };
    const { tracks, iTunesTracks } = this.data;
    iTunesTracks[newTrack.itunesId] = newTrack;
    tracks[newTrack.id] = newTrack;
    this.trackCount += 1;
  }
  getTracks() {
    const { tracks } = this.data;
    return Object.keys(tracks).map(key => tracks[key]);
  }
  getTrack(id: string) {
    return this.data.tracks[id];
  }
  getTrackByTunes(itunesId: string) {
    return this.data.iTunesTracks[itunesId];
  }

  addPlaylist(playlist: any) {
    const items = playlist['Playlist Items'];
    if (!(items || []).length) {
      return;
    }

    const newPlaylist = {
      id: String(playlist['Playlist ID']),
      name: playlist['Name'],
      iTunesIds: items.map(pi => String(pi['Track ID'])),
      tracks: [],
      trackIds: [],
    };
    const { iTunesPlaylists } = this.data;
    iTunesPlaylists[newPlaylist.id] = newPlaylist;
  }
  getPlaylists(filter?: Array<string>) {
    const { iTunesPlaylists } = this.data;
    return Object.keys(iTunesPlaylists)
      .map(key => iTunesPlaylists[key])
      .filter(playlist => filter ? filter.includes(playlist.name) : true)
      .map(playlist => {
        const tracks = playlist.iTunesIds.map(itunesId => this.getTrackByTunes(itunesId)).filter(t => t);
        return {
          ...playlist,
          tracks,
          trackIds: tracks.map(track => track.id),
        };
      });
  }

}

export class iTunesLibraryLoader {
  dataPromise: Promise<iTunesLibrary>;

  constructor(stream: fs.ReadStream) {
    Logger.log('building iTunes library...');
    const data = new iTunesLibrary();
    const parser = this.setupListeners(data);
    this.dataPromise = new Promise((resolve, reject) => {
      stream.on('end', () => {
        Logger.log('done building iTunes library');
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
    Logger.log('loading iTunes library...');
    const stream = fs.createReadStream(source);
    return new iTunesLibraryLoader(stream).dataPromise;
  }
}
