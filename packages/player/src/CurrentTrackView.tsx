import React from 'react';
import styled from 'styled-components';
import { PlayableTrack } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';
import { PlaybackControlProps, PlaybackControls } from './PlaybackControls';

const TrackContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: no-wrap;
`;

const AlbumContainer = styled.div`
  height: 100%;
`;
const AlbumCover = styled.img`
  width: auto;
  height: 100%;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  flex-grow: 1;
`;
const DetailsRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 0px 20px;
`;
const TrackTitle = styled(DetailsRow)`
  font-weight: bold;
  text-decoration: underline;
`;

interface Props extends PlaybackControlProps {
  track?: PlayableTrack,
};

export default class TrackView extends React.Component<Props> {
  render() {
    const { track } = this.props;
    if (!track) {
      return (
        <TrackContainer>
          <AlbumContainer>
            <AlbumCover src={PlaceholderImage} />
          </AlbumContainer>
          <DetailsContainer>
            Click on a track to start playing
          </DetailsContainer>
        </TrackContainer>
      );
    }
    return (
      <TrackContainer>
        <AlbumContainer>
          <AlbumCover src={track.imageSrc || PlaceholderImage} />
        </AlbumContainer>
        <DetailsContainer>
          <TrackTitle>
            {track.title}
          </TrackTitle>
          <DetailsRow>
            {track.artist}
          </DetailsRow>
          <DetailsRow>
            {track.album}
          </DetailsRow>
          <DetailsRow>
            {track.trackNumberDisplay}
          </DetailsRow>

          <PlaybackControls
            {...this.props}
          />
        </DetailsContainer>
      </TrackContainer>
    )
  }
}
