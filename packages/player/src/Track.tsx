import React from 'react';
import { InfoLookup, getAudioUrl } from 'jukebox-utils';

interface Props {
  infoLookup: InfoLookup,
  trackId: string,
};

export default class Track extends React.Component<Props> {
  render() {
    // todo store in audio obj, only display inteface
    const { trackId, infoLookup } = this.props;
    const track = infoLookup.get(trackId);
    return (
      <div>
        <div>
          {track.title}
        </div>
        <div>
          {track.artist}
        </div>
        {track.imageSrc && (
          <img src={track.imageSrc} />
        )}
        <audio controls src={getAudioUrl(trackId)}></audio>
      </div>
    )
  }
}
