import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, Manager } from 'jukebox-utils';
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
  manager: Manager,
  currentTrackList?: PlayableTrackList,
};

export default class PlaylistMenu extends React.Component<Props> {
  render() {
    const { manager, loadPlaylist, currentTrackList } = this.props;
    return (
      <SidebarContainer>
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
