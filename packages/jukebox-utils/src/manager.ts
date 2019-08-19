import { PlaylistBrowser } from './browser';
import { Collection } from './collection';
import { fetchCollection, fetchInfoLookup } from './fetch';
import { InfoLookup } from './infoLookup';
import { Playlist } from './playlist';
import { sortByFunc } from './tools';
import { PlaylistBrowserData, WebConfig, SearchResult } from './types';

export class Manager {
  static async fetch(webConfig: WebConfig): Promise<Manager> {
    const collection = await fetchCollection();
    const infoLookup = await fetchInfoLookup();
    return new Manager(webConfig, collection, infoLookup);
  }

  webConfig: WebConfig;
  playlists: Playlist[];
  allSongs: Playlist;
  browseAlbums: PlaylistBrowser;
  browseArtists: PlaylistBrowser;
  private collection: Collection;
  private infoLookup: InfoLookup;

  constructor(
    webConfig: WebConfig,
    collection: Collection,
    infoLookup: InfoLookup,
  ) {
    this.webConfig = webConfig;
    this.collection = collection;
    this.infoLookup = infoLookup;

    let playlistTracks = {};
    const unsortedPlaylists = Object.keys(collection.data.playlists)
      .filter(key =>
        webConfig.playlists ? webConfig.playlists.includes(key) : true,
      )
      .map(key => {
        const data = collection.data.playlists[key];
        playlistTracks = {
          ...playlistTracks,
          ...data.trackIds.reduce((obj, id) => {
            obj[id] = true;
            return obj;
          }, {}),
        };
        return Playlist.fromLookup(infoLookup, data, true);
      });
    unsortedPlaylists.sort(Playlist.compare);
    this.playlists = unsortedPlaylists;

    const allSongs = Playlist.fromLookup(infoLookup, {
      name: 'All Songs',
      trackIds: Object.keys(
        webConfig.playlists ? playlistTracks : collection.data.tracks,
      ),
    });

    const trackIdsByAlbum: PlaylistBrowserData = {};
    const trackIdsByArtist: PlaylistBrowserData = {};
    allSongs.tracks.forEach(track => {
      trackIdsByAlbum[track.album] = (
        trackIdsByAlbum[track.album] || []
      ).concat(track.id);
      trackIdsByArtist[track.artist] = (
        trackIdsByArtist[track.artist] || []
      ).concat(track.id);
    });

    this.allSongs = allSongs;
    this.browseAlbums = new PlaylistBrowser(
      infoLookup,
      'Albums',
      trackIdsByAlbum,
    );
    this.browseArtists = new PlaylistBrowser(
      infoLookup,
      'Artists',
      trackIdsByArtist,
    );
  }
  public search(query: string): SearchResult[] {
    if (!query || !query.length) {
      return [];
    }
    const found: SearchResult[] = [];
    const qParts = query.toLowerCase().split(' ');
    this.playlists.forEach(pl => {
      const results = pl.tracks.map(t => {
        const key = `${t.album} ${t.artist} ${t.title}`.toLowerCase();
        const score = qParts.filter(qp => key.includes(qp)).length;
        return {
          playlist: pl,
          track: t,
          score: score,
        };
      }).filter(sr => sr.score > 0);
      found.push(...results);
    });
    sortByFunc(found, sr => sr.score);
    return found.reverse();
  }
}
