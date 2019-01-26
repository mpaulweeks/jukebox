import React from 'react';
import styled from 'styled-components';
import { SongData } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';


const TrackContainer = styled.div`
  cursor: pointer;
  border: 1px solid black;
  padding: 5px;
  margin: 5px;
`;

const CurrentContainer = styled(TrackContainer)`
  background-color: lightblue;
`;

const TrackRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TrackTitle = styled(TrackRow)`
  font-size: 1.2em;
  text-decoration: underline;
`;

const AlbumCover = styled.img`
  width: 100px;
  height: auto;

  ${CurrentContainer} & {
    width: 300px;
  }
`;

interface Props {
  loadTrack: (track: SongData) => void,
  track: SongData,
  isCurrent?: boolean,
};

export default class Track extends React.Component<Props> {
  onClick = () => {
    const { track, loadTrack, isCurrent } = this.props;
    loadTrack(track);
  }
  truncate(info: string) {
    return info.substring(0, 20);
  }
  render() {
    // todo store in audio obj, only display inteface
    const { track, isCurrent } = this.props;
    const ContainerComp = isCurrent ? CurrentContainer : TrackContainer
    return (
      <ContainerComp onClick={this.onClick}>
        <TrackTitle>
          {track.title || 'Unknown Title'}
        </TrackTitle>
        <TrackRow>
          {this.truncate(track.artist || 'Unknown Artist')}
        </TrackRow>
        <TrackRow>
          <AlbumCover src={track.imageSrc || PlaceholderImage} />
        </TrackRow>
      </ContainerComp>
    )
  }
}
