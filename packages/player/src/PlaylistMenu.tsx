import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, Manager, PlaylistBrowser } from 'jukebox-utils';
import { FlexStretchMixin, CanHighlight, HoverMixin } from './components/Common';

import { setCurrentTrackList, setCurrentBrowser } from './redux/actions';
import { PlayerState } from './redux/reducers/player';
import { connect } from 'react-redux';
import { MasterState } from './redux/reducers';
import { DataState } from './redux/reducers/data';

const SidebarContainer = styled.div`
  ${FlexStretchMixin}
`;

const PlaylistName = styled(CanHighlight)`
  ${HoverMixin}
  box-sizing: border-box;
  padding: 5px;
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
              highlight={manager.allSongs === player.trackList}
            >
              {manager.allSongs.name}
            </PlaylistName>
            <PlaylistName
              onClick={() => setCurrentBrowser(manager.browseAlbums)}
              highlight={manager.browseAlbums === player.browser}
            >
              {manager.browseAlbums.name}
            </PlaylistName>
            <PlaylistName
              onClick={() => setCurrentBrowser(manager.browseArtists)}
              highlight={manager.browseArtists === player.browser}
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
            highlight={pl === player.trackList}
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
