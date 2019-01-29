import React from 'react';
import { Manager, PlaylistBrowser, PlayableTrack, PlayerSettings, PlayableTrackList } from 'jukebox-utils';
import TrackListView from './TrackListView';
import CurrentTrackView from './CurrentTrackView';
import PlaylistMenu from './PlaylistMenu';
import styled from 'styled-components';
import { BrowserView } from './BrowserView';
import { CollapseBottom, CollapseSidebar } from './Collapse';
import { CollapseAble } from './Components';

// todo pass colors as props
const RootContainer = styled.div`
  font-size: 16px;

  --jukebox-foreground: black;
  --jukebox-background: white;
  --jukebox-highlight: lightblue;
  --jukebox-collapse-foreground: white;
  --jukebox-collapse-background: green;
  --jukebox-frame-gap: 10px;

  background-color: var(--jukebox-background);
  color: var(--jukebox-foreground);

  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: no-wrap;
`;

const Header = styled(CollapseAble)`
  position: relative;
  width: 100%;
  height: 200px;
  margin: var(--jukebox-frame-gap);

  ${props => props.isCollapsed && `
    margin-top: -210px;
  `}
`;
const Body = styled.div`
  width: 100%;
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;
`;

const Box = styled(CollapseAble)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;

  height: 100%;

  border: 1px solid black;
  box-sizing: border-box;
  margin: var(--jukebox-frame-gap);
  padding: 10px;
`;

const SidebarBox = styled(Box)`
  position: relative;
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  margin-right: 0px;

  ${props => props.isCollapsed && `
    margin-left: -200px;
  `}
`;

const PlaylistBox = styled(Box)`
  flex-grow: 1;
`;

interface State {
  manager?: Manager,
  settings: PlayerSettings,
  currentTrack?: PlayableTrack,
  currentTrackList?: PlayableTrackList,
  currentBrowser?: PlaylistBrowser,
  collapseHeader: boolean,
  collapseSidebar: boolean,
};

export default class App extends React.Component<any, State> {
  audioElm = new Audio();
  state: State = {
    settings: {
      isPlaying: false,
      repeat: false,
      shuffle: false,
    },
    collapseHeader: false,
    collapseSidebar: false,
  };

  componentDidMount() {
    // debuging
    const debugWindow: any = window;
    debugWindow.app = this;

    document.addEventListener('keydown', evt => {
      switch (evt.code) {
        case 'ArrowLeft':
          return this.prevTrack(evt);
        case 'ArrowRight':
          return this.nextTrack(evt);
        case 'Space':
          return this.onSpaceBar(evt);
        default:
        // Logger.log(evt);
      }
    });
    this.audioElm.addEventListener('ended', () => this.onTrackEnd());

    Manager.fetch().then(manager => this.setState({
      manager: manager,
    }, () => {
      // this.loadPlaylist(manager.playlists[0]);
      this.loadBrowser(manager.browseAlbums);
    }));
  }

  loadTrack = (track: PlayableTrack, force?: boolean) => {
    // todo make this redux
    const newSource = track.audioSrc;
    if (force || newSource !== this.audioElm.src) {
      this.audioElm.src = newSource;

      this.setState({
        currentTrack: track,
        settings: {
          ...this.state.settings,
          isPlaying: true,
        },
      });
    }
  }
  loadPlaylist = (playlist: PlayableTrackList) => {
    // todo make this redux
    const { currentTrackList } = this.state;
    if (!currentTrackList || currentTrackList.name !== playlist.name) {
      this.setState({
        currentTrackList: playlist,
        currentBrowser: undefined,
      });
    }
  }
  loadBrowser = (browser: PlaylistBrowser) => {
    // todo make this redux
    this.setState({
      currentTrackList: undefined,
      currentBrowser: browser,
    });
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
      this.togglePlay();
    } else if (currentTrackList) {
      this.loadTrack(currentTrackList.tracks[0]);
    }
    if (keyboardEvent) {
      keyboardEvent.preventDefault();
    }
  }

  togglePlay = () => {
    const { settings } = this.state;
    this.setState({
      settings: {
        ...settings,
        isPlaying: !settings.isPlaying,
      },
    });
  }
  toggleShuffle = () => {
    const { settings } = this.state;
    this.setState({
      settings: {
        ...settings,
        shuffle: !settings.shuffle,
      },
    });
  }
  toggleRepeat = () => {
    const { settings } = this.state;
    this.setState({
      settings: {
        ...settings,
        repeat: !settings.repeat,
      },
    });
  }

  toggleHeader = () => {
    this.setState({
      collapseHeader: !this.state.collapseHeader,
    });
  }
  toggleSidebar = () => {
    this.setState({
      collapseSidebar: !this.state.collapseSidebar,
    });
  }

  render() {
    const { manager, settings, currentTrack, currentTrackList, currentBrowser, collapseHeader, collapseSidebar } = this.state;
    if (!manager) {
      return (
        <h3> loading, please wait... </h3>
      );
    }

    // todo move into DidReceiveProps
    const { audioElm } = this;
    if (settings.isPlaying) {
      audioElm.play();
    } else {
      audioElm.pause();
    }

    const { loadTrack, loadPlaylist, loadBrowser } = this;
    return (
      <RootContainer>
        <Header isCollapsed={collapseHeader}>
          <Box>
            <CurrentTrackView
              track={currentTrack}
              settings={settings}
              nextTrack={this.nextTrack}
              prevTrack={this.prevTrack}
              togglePlay={this.togglePlay}
              toggleShuffle={this.toggleShuffle}
              toggleRepeat={this.toggleRepeat}
            />
            <CollapseBottom
              onClick={this.toggleHeader}
              isCollapsed={collapseHeader}
            />
          </Box>
        </Header>
        <Body>
          <SidebarBox isCollapsed={collapseSidebar}>
            <PlaylistMenu
              loadPlaylist={loadPlaylist}
              loadBrowser={loadBrowser}
              manager={manager}
              currentTrackList={currentTrackList}
              currentBrowser={currentBrowser}
            />
            <CollapseSidebar
              onClick={this.toggleSidebar}
              isCollapsed={collapseSidebar}
            />
          </SidebarBox>
          <PlaylistBox>
            {currentBrowser ? (
              <BrowserView
                loadPlaylist={loadPlaylist}
                browser={currentBrowser}
              />
            ) : (
                <TrackListView
                  loadTrack={loadTrack}
                  playlist={currentTrackList}
                  currentTrack={currentTrack}
                />
              )}
          </PlaylistBox>
        </Body>
      </RootContainer>
    )

  }
}
