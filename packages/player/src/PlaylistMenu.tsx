import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, Manager, PlaylistBrowser } from 'jukebox-utils';
import { FlexStretchMixin } from './Components';

import { setCurrentTrackList, setCurrentBrowser } from './redux/actions';
import { PlayerState } from './redux/reducers/player';
import { connect } from 'react-redux';
import { MasterState } from './redux/reducers';
import { DataState } from './redux/reducers/data';

const SidebarContainer = styled.div`
  ${FlexStretchMixin}
`;

const PlaylistName = styled('div')<{ isCurrent: boolean }>`
  cursor: pointer;
  box-sizing: border-box;
  padding: 5px;

  ${props =>
    props.isCurrent &&
    `
    background-color: var(--jukebox-highlight);
  `}
`;

interface Props {
  setCurrentTrackList(trackList: PlayableTrackList): void;
  setCurrentBrowser(browser: PlaylistBrowser): void;
  data: DataState;
  player: PlayerState;
}

class PlaylistMenu extends React.Component<Props> {
  render() {
    const { data, player, setCurrentTrackList, setCurrentBrowser } = this.props;
    const { manager } = data;
    if (!manager) {
      throw new Error('PlaylistMenu should not be rendered in this state!');
    }
    return (
      <SidebarContainer>
        {!manager.webConfig.HideAggregateLists && (
          <div>
            <PlaylistName
              onClick={() => setCurrentTrackList(manager.allSongs)}
              isCurrent={manager.allSongs === player.trackList}
            >
              {manager.allSongs.name}
            </PlaylistName>
            <PlaylistName
              onClick={() => setCurrentBrowser(manager.browseAlbums)}
              isCurrent={manager.browseAlbums === player.browser}
            >
              {manager.browseAlbums.name}
            </PlaylistName>
            <PlaylistName
              onClick={() => setCurrentBrowser(manager.browseArtists)}
              isCurrent={manager.browseArtists === player.browser}
            >
              {manager.browseArtists.name}
            </PlaylistName>
            <hr />
          </div>
        )}
        {manager.playlists.map((pl, index) => (
          <PlaylistName
            key={`playlist-name-${index}`}
            onClick={() => setCurrentTrackList(pl)}
            isCurrent={pl === player.trackList}
          >
            {pl.name}
          </PlaylistName>
        ))}
      </SidebarContainer>
    );
  }
}

export default connect(
  (state: MasterState) => ({
    data: state.data,
    player: state.player,
  }),
  {
    setCurrentTrackList,
    setCurrentBrowser,
  },
)(PlaylistMenu);
