import React from 'react';
import styled from 'styled-components';
import { truncate } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';
import { connect } from 'react-redux';
import { PlayerState } from './redux/reducers/player';
import { MasterState } from './redux/reducers';

const TrackContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: no-wrap;

  @media (max-width: 600px){
    flex-direction: column;
  }
`;

const AlbumContainer = styled.div``;
const AlbumCover = styled.img`
  width: auto;
  height: 100%;

  @media (max-width: 600px){
    width: 100%;
    height: auto;
  }
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
  text-align: center;
`;
const TrackTitle = styled(DetailsRow)`
  font-size: 2.5em;
  font-weight: bold;
`;
const TrackArtist = styled(DetailsRow)`
  font-size: 1.5em;
  font-style: italic;
`;
const TrackAlbum = styled(DetailsRow)`
  font-size: 1.5em;
  font-weight: bold;
`;

interface Props {
  player: PlayerState;
}

class TrackView extends React.Component<Props> {
  render() {
    const { track } = this.props.player;
    if (!track) {
      return (
        <TrackContainer>
          <AlbumContainer>
            <AlbumCover src={PlaceholderImage} />
          </AlbumContainer>
          <DetailsContainer>Click on a track to start playing</DetailsContainer>
        </TrackContainer>
      );
    }
    return (
      <TrackContainer>
        <AlbumContainer>
          <AlbumCover src={track.imageSrc || PlaceholderImage} />
        </AlbumContainer>
        <DetailsContainer>
          <TrackTitle>{track.title}</TrackTitle>
          <TrackArtist>{truncate(track.artist, 80)}</TrackArtist>
          <TrackAlbum>{track.album}</TrackAlbum>
        </DetailsContainer>
      </TrackContainer>
    );
  }
}

const mapStateToProps = (state: MasterState) => ({
  player: state.player,
});
export default connect(mapStateToProps)(TrackView);
