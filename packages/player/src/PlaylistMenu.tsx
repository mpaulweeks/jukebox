import React from 'react';
import styled from 'styled-components';
import { Playlist, Manager } from 'jukebox-utils';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;

  width: 100%;
`;

const PlaylistName = styled.div`
  margin: 10px;
`;

interface Props {
  loadPlaylist: (playlist: Playlist) => void,
  manager: Manager,
};

export default class PlaylistMenu extends React.Component<Props> {
  render() {
    const { manager, loadPlaylist } = this.props;
    return (
      <SidebarContainer>
        {manager.playlists.map((pl, index) => (
          <PlaylistName
            key={`playlist-name-${index}`}
            onClick={() => loadPlaylist(pl)}
          >
            {pl.name}
          </PlaylistName>
        ))}
      </SidebarContainer>
    )
  }
}
