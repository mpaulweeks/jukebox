import React from 'react';
import { Manager, Track, Playlist } from 'jukebox-utils';
import PlaylistView from './PlaylistView';
import CurrentTrackView from './CurrentTrackView';
import PlaylistMenu from './PlaylistMenu';
import styled from 'styled-components';

const Header = styled.div`
  height: 200px;
`;
const Body = styled.div`
  height: calc(100% - 200px);

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;

  height: 100%;

  border: 1px solid black;
  box-sizing: border-box;
  margin: 10px;
  padding: 10px;
`;

const SidebarBox = styled(Box)`
  width: 200px;
  margin-right: 0px;
`;

const PlaylistBox = styled(Box)`
  flex-grow: 1;
`;

interface State {
  manager?: Manager,
  currentTrack?: Track,
  currentPlaylist?: Playlist,
};

export default class App extends React.Component<any, State> {
  audioElm = new Audio();
  state: State = {};

  componentDidMount() {
    Manager.fetch().then(manager => this.setState({
      manager: manager,
    }, () => {
      this.loadPlaylist(manager.playlists[1]);
    }));
  }

  loadTrack = (track: Track) => {
    // todo make this redux
    const newSource = track.audioSrc;
    if (newSource !== this.audioElm.src) {
      this.audioElm.src = newSource;
      this.audioElm.play();

      this.setState({
        currentTrack: track,
      });
    }
  }
  loadPlaylist = (playlist: Playlist) => {
    // todo make this redux
    const { currentPlaylist } = this.state;
    if (!currentPlaylist || currentPlaylist.name !== playlist.name) {
      this.setState({
        currentPlaylist: playlist,
      }, () => {
        this.loadTrack(playlist.tracks[0]);
      });
    }
  }

  render() {
    console.log('state:', this.state);

    const { manager, currentTrack, currentPlaylist } = this.state;
    if (!manager) {
      return (
        <h3> loading, please wait... </h3>
      );
    }

    const { loadTrack, loadPlaylist } = this;
    return (
      <div>
        <Header>
          <Box>
            <CurrentTrackView
              track={currentTrack}
            />
          </Box>
        </Header>
        <Body>
          <SidebarBox>
            <PlaylistMenu
              loadPlaylist={loadPlaylist}
              manager={manager}
            />
          </SidebarBox>
          <PlaylistBox>
            <PlaylistView
              loadTrack={loadTrack}
              playlist={currentPlaylist}
            />
          </PlaylistBox>
        </Body>
      </div>
    )

  }
}
