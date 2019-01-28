import React from 'react';
import styled from 'styled-components';
import { Playlist, Manager } from 'jukebox-utils';
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
  loadPlaylist: (playlist: Playlist) => void,
  manager: Manager,
  currentPlaylist?: Playlist,
};

export default class PlaylistMenu extends React.Component<Props> {
  render() {
    const { manager, loadPlaylist, currentPlaylist } = this.props;
    return (
      <SidebarContainer>
        {manager.playlists.map((pl, index) => (
          <PlaylistName
            key={`playlist-name-${index}`}
            onClick={() => loadPlaylist(pl)}
            isCurrent={pl === currentPlaylist}
          >
            {pl.name}
          </PlaylistName>
        ))}
      </SidebarContainer>
    )
  }
}
