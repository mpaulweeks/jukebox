import React from 'react';
import { PlaylistData, InfoLookup } from 'jukebox-utils';
import Track from './Track';

interface Props {
  infoLookup: InfoLookup,
  playlist: PlaylistData,
};

export default class Playlist extends React.Component<Props> {
  render() {
    const { playlist, infoLookup } = this.props;
    return (
      <div>
        <h3>{playlist.name}</h3>
        {playlist.trackIds.map((id, index) => (
          <Track
            key={`track-${index}`}
            trackId={id}
            infoLookup={infoLookup}
          />
        ))}
      </div>
    )
  }
}
