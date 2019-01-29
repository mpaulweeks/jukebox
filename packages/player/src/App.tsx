import React from 'react';
import { Manager, Logger, PlayableTrack, PlayerSettings, PlayableTrackList } from 'jukebox-utils';
import TrackListView from './TrackListView';
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
  settings: PlayerSettings,
  currentTrack?: PlayableTrack,
  currentTrackList?: PlayableTrackList,
};

export default class App extends React.Component<any, State> {
  audioElm = new Audio();
  state: State = {
    settings: {
      repeat: false,
      shuffle: true,
    },
  };

  componentDidMount() {
    document.addEventListener('keydown', evt => {
      switch (evt.code) {
        case 'ArrowLeft':
          return this.prevTrack(evt);
        case 'ArrowRight':
          return this.nextTrack(evt);
        case 'Space':
          return this.onSpaceBar(evt);
        default:
          Logger.log(evt);
        // nothing
      }
    });
    this.audioElm.addEventListener('ended', () => this.onTrackEnd());

    Manager.fetch().then(manager => this.setState({
      manager: manager,
    }, () => {
      this.loadPlaylist(manager.playlists[0]);
    }));
  }

  loadTrack = (track: PlayableTrack, force?: boolean) => {
    // todo make this redux
    const newSource = track.audioSrc;
    if (force || newSource !== this.audioElm.src) {
      this.audioElm.src = newSource;
      this.audioElm.play();

      this.setState({
        currentTrack: track,
      });
    }
  }
  loadPlaylist = (playlist: PlayableTrackList) => {
    // todo make this redux
    const { currentTrackList } = this.state;
    if (!currentTrackList || currentTrackList.name !== playlist.name) {
      this.setState({
        currentTrackList: playlist,
      });
    }
  }

  nextTrack = (keyboardEvent?: any) => {
    const { settings, currentTrack, currentTrackList } = this.state;
    if (currentTrack && currentTrackList) {
      const newTrack = currentTrackList.nextTrack(settings, currentTrack);
      this.loadTrack(newTrack);
    }
  }
  prevTrack = (keyboardEvent?: any) => {
    const { settings, currentTrack, currentTrackList } = this.state;
    if (currentTrack && currentTrackList) {
      const newTrack = currentTrackList.prevTrack(settings, currentTrack);
      this.loadTrack(newTrack);
    }
  }
  onTrackEnd = (keyboardEvent?: any) => {
    const { settings } = this.state;
    if (settings.repeat) {
      this.audioElm.play();
    } else {
      this.nextTrack();
    }
  }
  onSpaceBar = (keyboardEvent?: any) => {
    const { currentTrack, currentTrackList } = this.state;
    if (currentTrack) {
      const { audioElm } = this;
      if (audioElm.paused) {
        audioElm.play();
      } else {
        audioElm.pause();
      }
    } else if (currentTrackList) {
      this.loadTrack(currentTrackList.tracks[0]);
    }
    if (keyboardEvent) {
      keyboardEvent.preventDefault();
    }
  }

  render() {
    const { manager, currentTrack, currentTrackList } = this.state;
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
              currentTrackList={currentTrackList}
            />
          </SidebarBox>
          <PlaylistBox>
            <TrackListView
              loadTrack={loadTrack}
              playlist={currentTrackList}
              currentTrack={currentTrack}
            />
          </PlaylistBox>
        </Body>
      </div>
    )

  }
}
