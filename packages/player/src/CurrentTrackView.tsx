import React from 'react';
import styled from 'styled-components';
import { PlayableTrack } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';
import { connect } from 'react-redux';
import { PlayerState } from './redux/reducers/player';

const TrackContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: no-wrap;
`;

const AlbumContainer = styled.div`

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

interface Props {
  player: PlayerState,
};

class TrackView extends React.Component<Props> {
  render() {
    const { track } = this.props.player;
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
        </DetailsContainer>
      </TrackContainer>
    )
  }
}

const mapStateToProps = (state: any) => ({
  player: state.player,
})
export default connect(mapStateToProps)(TrackView);
