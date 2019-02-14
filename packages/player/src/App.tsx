import React from 'react';
import { Manager, PlaylistBrowser, PlayableTrack, PlayerSettings, PlayableTrackList, Logger, Constants, DefaultWebConfig, getWebConfig } from 'jukebox-utils';
import TrackListView from './TrackListView';
import CurrentTrackView from './CurrentTrackView';
import PlaylistMenu from './PlaylistMenu';
import styled from 'styled-components';
import { BrowserView } from './BrowserView';
import { CollapseRoot, CollapseBottom, CollapseSidebar } from './Collapse';
import { CollapseAble, FlexStretchMixin, ResetMixin } from './Components';
import { PlaybackControls } from './PlaybackControls';
import { ColorScheme, getColorScheme } from './ColorScheme';
import { setCurrentTrack } from './redux/actions';
import { connect } from 'react-redux';

// todo pass colors as props
const RootContainer = styled(CollapseAble)`
  ${FlexStretchMixin}

  position: fixed;
  z-index: 2147483647; /* max possible */
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  ${props => props.isCollapsed && `
    top: -100%;
  `};
`;

const RootInner = styled('div') <{ colorScheme: ColorScheme }>`
  ${FlexStretchMixin}

  font-size: 16px;

  --jukebox-foreground: ${props => props.colorScheme.foreground};
  --jukebox-background: ${props => props.colorScheme.background};
  --jukebox-hover: ${props => props.colorScheme.hover};
  --jukebox-highlight: ${props => props.colorScheme.highlight};
  --jukebox-collapse-foreground: ${props => props.colorScheme.collapseForeground};
  --jukebox-collapse-background: ${props => props.colorScheme.collapseBackground};

  --jukebox-frame-gap: 10px;
  background-color: var(--jukebox-background);
  color: var(--jukebox-foreground);
`;

const Header = styled.div`
`;
const BodyContainer = styled.div`
  ${FlexStretchMixin}
  flex-direction: row;
`;

const BoxWrapper = styled(CollapseAble)`
  ${FlexStretchMixin}
  padding: var(--jukebox-frame-gap);
`;
const HeaderBoxWrapper = styled(BoxWrapper)`
  padding-bottom: 0px;
  height: 200px;
  ${props => props.isCollapsed && `
    margin-top: calc(-200px - var(--jukebox-frame-gap));
  `}
`;
const FooterBoxWrapper = styled(BoxWrapper)`
  padding-top: 0px;
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

  ${FlexStretchMixin}

  border: 1px solid var(--jukebox-foreground);
  box-sizing: border-box;
  padding: 10px;
`;

interface Props {
  codeConfig: DefaultWebConfig,
  setCurrentTrack(track: PlayableTrack): void,
};
interface State {
  manager?: Manager,
  colorScheme: ColorScheme,
  settings: PlayerSettings,
  currentTrack?: PlayableTrack,
  currentTrackList?: PlayableTrackList,
  currentBrowser?: PlaylistBrowser,
  collapseRoot: boolean,
  collapseHeader: boolean,
  collapseSidebar: boolean,
};

class App extends React.Component<Props, State> {
  audioElm = new Audio();
  webConfig = getWebConfig(this.props.codeConfig);
  state: State = {
    manager: undefined,
    colorScheme: getColorScheme(this.webConfig.ColorScheme),
    settings: {
      isPlaying: false,
      repeat: false,
      shuffle: false,
    },
    currentTrack: undefined,
    currentTrackList: undefined,
    currentBrowser: undefined,
    collapseRoot: !this.webConfig.OnlyJukebox,
    collapseHeader: false,
    collapseSidebar: false,
  };

  componentDidMount() {
    // debuging
    const appWindow: any = window;
    appWindow.JD = {
      app: this,
      config: this.webConfig,
      constants: Constants,
    };
    // public API
    appWindow.JUKEBOX = {
      toggle: this.toggleCollapseRoot,
    };

    // setup listeners
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

    // load fonts
    [
      // https://stackoverflow.com/a/27053825
      'https://fonts.googleapis.com/icon?family=Material+Icons',
    ].forEach(fontSrc => {
      const linkElm = document.createElement('link');
      linkElm.setAttribute('rel', 'stylesheet');
      linkElm.setAttribute('href', fontSrc);
      document.head.appendChild(linkElm);
    });

    // fetch data, start app
    Manager.fetch(this.webConfig).then(manager => this.setState({
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

      this.props.setCurrentTrack(track);
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
    this.togglePlay();
    if (keyboardEvent) {
      keyboardEvent.preventDefault();
    }
  }

  togglePlay = () => {
    const { currentTrack, currentTrackList, settings } = this.state;
    if (!currentTrack && !currentTrackList) {
      // on app load. dont do anything
      return;
    }
    if (!currentTrack && currentTrackList) {
      this.loadTrack(currentTrackList.tracks[0]);
    }
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
    const { manager, colorScheme, settings, currentTrack, currentTrackList, currentBrowser, collapseRoot, collapseHeader, collapseSidebar } = this.state;
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

    const { webConfig, loadTrack, loadPlaylist, loadBrowser } = this;
    return (
      <RootContainer isCollapsed={collapseRoot}>
        <RootInner colorScheme={colorScheme}>
          <Header>
            <HeaderBoxWrapper isCollapsed={collapseHeader}>
              <Box>
                <CurrentTrackView />
                {webConfig.OnlyJukebox ? (
                  <CollapseBottom
                    onClick={this.toggleCollapseHeader}
                    isCollapsed={collapseHeader}
                  />
                ) : (
                    <CollapseRoot
                      onClick={this.toggleCollapseRoot}
                      isCollapsed={false}
                    />
                  )}
              </Box>
            </HeaderBoxWrapper>
          </Header>
          <BodyContainer>
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
                  {webConfig.OnlyJukebox && (
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
          </BodyContainer>
          <Header>
            <FooterBoxWrapper>
              <Box>
                <PlaybackControls
                  settings={settings}
                  nextTrack={this.nextTrack}
                  prevTrack={this.prevTrack}
                  togglePlay={this.togglePlay}
                  toggleShuffle={this.toggleShuffle}
                  toggleRepeat={this.toggleRepeat}
                />
              </Box>
            </FooterBoxWrapper>
          </Header>
        </RootInner>
      </RootContainer>
    )
  }
}

const mapStateToProps = (state: any) => {

}

export default connect(mapStateToProps, {
  setCurrentTrack,
})(App);
