import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, Manager, Config, PlaylistBrowser } from 'jukebox-utils';
import { DisplayConstants } from './DisplayConstants';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;

  width: 100%;
`;

const PlaylistName = styled('div') <{ isCurrent: boolean }>`
  cursor: pointer;
  box-sizing: border-box;
  padding: 5px;

  ${props => props.isCurrent && `
    background-color: ${DisplayConstants.Highlight};
  `}
`;

interface Props {
  loadPlaylist: (playlist: PlayableTrackList) => void,
  loadBrowser: (browser: PlaylistBrowser) => void,
  manager: Manager,
  currentTrackList?: PlayableTrackList,
  currentBrowser?: PlaylistBrowser,
};

export default class PlaylistMenu extends React.Component<Props> {
  render() {
    const { manager, loadPlaylist, loadBrowser, currentTrackList, currentBrowser } = this.props;
    return (
      <SidebarContainer>
        {!Config.HideOtherLists && (
          <div>
            <PlaylistName
              onClick={() => loadPlaylist(manager.allSongs)}
              isCurrent={manager.allSongs === currentTrackList}
            >
              {manager.allSongs.name}
            </PlaylistName>
            <PlaylistName
              onClick={() => loadBrowser(manager.browseAlbums)}
              isCurrent={manager.browseAlbums === currentBrowser}
            >
              {manager.browseAlbums.name}
            </PlaylistName>
            <PlaylistName
              onClick={() => loadBrowser(manager.browseArtists)}
              isCurrent={manager.browseArtists === currentBrowser}
            >
              {manager.browseArtists.name}
            </PlaylistName>
            <hr />
          </div>
        )}
        {manager.playlists.map((pl, index) => (
          <PlaylistName
            key={`playlist-name-${index}`}
            onClick={() => loadPlaylist(pl)}
            isCurrent={pl === currentTrackList}
          >
            {pl.name}
          </PlaylistName>
        ))}
      </SidebarContainer>
    )
  }
}
