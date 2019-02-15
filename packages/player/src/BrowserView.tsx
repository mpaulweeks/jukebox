import React, { Component } from 'react';
import styled from 'styled-components';
import { PlayableTrackList, PlaylistBrowser } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';
import { MainViewScrollable, MainViewContainer, MainTitle } from './components/Common';
import { connect } from 'react-redux';
import { setCurrentTrackList } from './redux/actions';
import { PlayerState } from './redux/reducers/player';
import { MasterState } from './redux/reducers';

const BrowserContainer = styled(MainViewContainer)``;

const TrackListsContainer = styled(MainViewScrollable)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: no-wrap;

  width: 20%;
  padding: 5px;
  box-sizing: border-box;

  cursor: pointer;
  &:hover {
    border: 1px solid grey;
    border-radius: 5px;
    padding: 4px;
  }
`;

const TrackListImage = styled.img`
  width: 90%;
  height: auto;
`;
const TrackListInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  text-align: center;
  margin: 2px 0px;

  &:first-child {
    margin-bottom: 8px;
  }
`;

interface Props {
  player: PlayerState;
  setCurrentTrackList(trackList: PlayableTrackList): void;
}

class BrowserView extends React.Component<Props> {
  truncate(info: string) {
    return (info || '').substring(0, 20);
  }
  render() {
    const { player, setCurrentTrackList } = this.props;
    const { browser } = player;

    if (!browser) {
      throw new Error('BrowserView should not be rendered in this state!');
    }
    return (
      <BrowserContainer>
        <MainTitle>{browser.name}</MainTitle>
        <TrackListsContainer>
          {browser.playlists.map((pl, index) => (
            <TrackList
              key={`playlist-${index}`}
              onClick={() => setCurrentTrackList(pl)}
            >
              <TrackListInfo>
                <TrackListImage src={pl.imageSrc || PlaceholderImage} />
              </TrackListInfo>
              <TrackListInfo>
                <b>{pl.album || '???'}</b>
              </TrackListInfo>
              <TrackListInfo>{pl.artist || '???'}</TrackListInfo>
            </TrackList>
          ))}
        </TrackListsContainer>
      </BrowserContainer>
    );
  }
}

export default connect(
  (state: MasterState) => ({
    player: state.player,
  }),
  {
    setCurrentTrackList,
  },
)(BrowserView);
