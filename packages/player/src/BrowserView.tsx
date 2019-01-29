import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, PlaylistBrowser } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';

const BrowserContainer = styled.div`
  width: 100%;
`;

const TrackListsContainer = styled.div`
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

  width: 300px;
  padding: 5px;

  cursor: pointer;
  &:hover {
    border: 1px solid grey;
    border-radius: 5px;
    padding: 4px;
  }
`;

const TrackListImage = styled.img`
  width: 200px;
  height: auto;
`;
const TrackListInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  text-align: center;
  margin: 5px 0px;
`;


interface Props {
  loadPlaylist: (playlist: PlayableTrackList) => void,
  browser: PlaylistBrowser,
};

export class BrowserView extends React.Component<Props> {
  truncate(info: string) {
    return (info || '').substring(0, 20);
  }
  render() {
    const { loadPlaylist, browser } = this.props;
    return (
      <BrowserContainer>
        <h1>{browser.name}</h1>
        <TrackListsContainer>
          {browser.playlists.map((pl, index) => (
            <TrackList
              key={`playlist-${index}`}
              onClick={() => loadPlaylist(pl)}
            >
              <TrackListInfo>
                <TrackListImage src={pl.imageSrc || PlaceholderImage} />
              </TrackListInfo>
              <TrackListInfo>
                <b>{pl.album || '???'}</b>
              </TrackListInfo>
              <TrackListInfo>
                {pl.artist || '???'}
              </TrackListInfo>
            </TrackList>
          ))}
        </TrackListsContainer>
      </BrowserContainer>
    )
  }
}
