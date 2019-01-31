import React from 'react';
import { Manager, PlaylistBrowser, PlayableTrack, PlayerSettings, PlayableTrackList, WebConfig, Logger } from 'jukebox-utils';
import TrackListView from './TrackListView';
import CurrentTrackView from './CurrentTrackView';
import PlaylistMenu from './PlaylistMenu';
import styled from 'styled-components';
import { BrowserView } from './BrowserView';
import { CollapseRoot, CollapseBottom, CollapseSidebar } from './Collapse';
import { CollapseAble } from './Components';

// todo pass colors as props
const RootContainer = styled(CollapseAble)`
  font-size: 16px;

  --jukebox-foreground: black;
  --jukebox-background: white;
  --jukebox-highlight: lightblue;
  --jukebox-collapse-foreground: white;
  --jukebox-collapse-background: grey;
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
  align-items: stretch;
  flex-wrap: no-wrap;

  ${props => props.isCollapsed && `
    top: -100%;
  `};
`;

const Header = styled.div`
  width: 100%;
`;
const Body = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: no-wrap;
`;

const BoxWrapper = styled(CollapseAble)`
  padding: var(--jukebox-frame-gap);
`;
const HeaderBoxWrapper = styled(BoxWrapper)`
  padding-bottom: 0px;
  height: 200px;
  ${props => props.isCollapsed && `
    margin-top: calc(-200px - var(--jukebox-frame-gap));
  `}
`;
const SidebarBoxWrapper = styled(BoxWrapper)`
  padding-right: 0px;
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  ${props => props.isCollapsed && `
    margin-left: calc(-200px - var(--jukebox-frame-gap));
  `}
`;
const MainViewBoxWrapper = styled(BoxWrapper)`
  flex-grow: 1;
`;

const Box = styled.div`
  position: relative;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: no-wrap;

  border: 1px solid black;
  box-sizing: border-box;
  padding: 10px;
`;

interface State {
  manager?: Manager,
  settings: PlayerSettings,
  currentTrack?: PlayableTrack,
  currentTrackList?: PlayableTrackList,
  currentBrowser?: PlaylistBrowser,
  collapseRoot: boolean,
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
    collapseRoot: !WebConfig.OnlyJukebox,
    collapseHeader: false,
    collapseSidebar: false,
  };

  componentDidMount() {
    // debuging
    const appWindow: any = window;
    appWindow.app = this;

    // public API
    appWindow.openJukebox = this.toggleCollapseRoot;

    Logger.log(WebConfig);

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
      if (manager.playlists.length) {
        this.loadPlaylist(manager.playlists[0]);
      }
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

  toggleCollapseRoot = () => {
    this.setState({
      collapseRoot: !this.state.collapseRoot,
    });
  }
  toggleCollapseHeader = () => {
    this.setState({
      collapseHeader: !this.state.collapseHeader,
    });
  }
  toggleCollapseSidebar = () => {
    this.setState({
      collapseSidebar: !this.state.collapseSidebar,
    });
  }

  render() {
    const { manager, settings, currentTrack, currentTrackList, currentBrowser, collapseRoot, collapseHeader, collapseSidebar } = this.state;
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
      <RootContainer isCollapsed={collapseRoot}>
        <Header>
          <HeaderBoxWrapper isCollapsed={collapseHeader}>
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
              {WebConfig.OnlyJukebox ? (
                <CollapseBottom
                  onClick={this.toggleCollapseHeader}
                  isCollapsed={collapseHeader}
                />
              ) : (
                  <CollapseRoot
                    onClick={this.toggleCollapseRoot}
                    isCollapsed={false}
                  >
                    exit jukebox
                </CollapseRoot>
                )}
            </Box>
          </HeaderBoxWrapper>
        </Header>
        <Body>
          {manager.playlists.length > 1 && (
            <SidebarBoxWrapper isCollapsed={collapseSidebar}>
              <Box>
                <PlaylistMenu
                  loadPlaylist={loadPlaylist}
                  loadBrowser={loadBrowser}
                  manager={manager}
                  currentTrackList={currentTrackList}
                  currentBrowser={currentBrowser}
                />
                {WebConfig.OnlyJukebox && (
                  <CollapseSidebar
                    onClick={this.toggleCollapseSidebar}
                    isCollapsed={collapseSidebar}
                  />
                )}
              </Box>
            </SidebarBoxWrapper>
          )}
          <MainViewBoxWrapper>
            <Box>
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
            </Box>
          </MainViewBoxWrapper>
        </Body>
      </RootContainer>
    )

  }
}
