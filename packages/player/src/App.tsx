import React from 'react';
import {
  Manager,
  PlayableTrack,
  PlayableTrackList,
  Constants,
  DefaultWebConfig,
  getWebConfig,
  Logger,
} from 'jukebox-utils';
import TrackListView from './TrackListView';
import CurrentTrackView from './CurrentTrackView';
import PlaylistMenu from './PlaylistMenu';
import styled from 'styled-components';
import BrowserView from './BrowserView';
import { CollapseRoot, CollapseBottom, CollapseSidebar } from './components/Collapse';
import { CollapseAble, FlexStretchMixin, Box } from './components/Common';
import PlaybackControls from './components/PlaybackControls';
import { ColorScheme, getColorScheme } from './ColorScheme';
import {
  setManager,
  setCurrentTrack,
  setCurrentTrackList,
  toggleCollapseHeader,
  toggleCollapseRoot,
  toggleCollapseSidebar,
  toggleIsPlaying,
  toggleIsShuffle,
  toggleIsRepeat,
  seekNextTrack,
  seekPrevTrack,
  setSeekByDelta,
  setIsPlaying,
} from './redux/actions';
import { connect } from 'react-redux';
import { PlayerState } from './redux/reducers/player';
import { MasterState } from './redux/reducers';
import AudioElm from './components/AudioElm';
import { UiState } from './redux/reducers/ui';
import { DataState } from './redux/reducers/data';
import PopupAbout from './components/PopupAbout';
import ProgressBar from './components/ProgressBar';

const RootContainer = styled(CollapseAble) <{ colorScheme: ColorScheme }>`
  --jukebox-z-index: 2147483646; /* max possible - 1 */
  --jukebox-popup-z-index: 2147483647; /* max possible */
  --jukebox-foreground: ${props => props.colorScheme.foreground};
  --jukebox-background: ${props => props.colorScheme.background};
  --jukebox-highlight-foreground: ${props => props.colorScheme.highlightForeground};
  --jukebox-highlight-background: ${props => props.colorScheme.highlightBackground};
  --jukebox-border-width: 1px;
  --jukebox-frame-gap: 10px;
  --jukebox-tab-size: 50px;

  ${FlexStretchMixin}

  position: fixed;
  z-index: var(--jukebox-z-index);
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  ${props =>
    props.isCollapsed &&
    `
    top: -100%;
  `};

  & a {
    color: var(--jukebox-foreground);
  }

  @media (max-width: 600px) {
    position: absolute;
    height: auto;
    top: 0px;
    ${props => props.isCollapsed && `
      left: -100%;
    `};
  }
`;

const RootInner = styled('div')`
  ${FlexStretchMixin}

  font-size: 16px;

  background-color: var(--jukebox-background);
  color: var(--jukebox-foreground);
`;

const Header = styled.div``;
const BodyContainer = styled.div`
  ${FlexStretchMixin}
  flex-direction: row;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const BoxWrapper = styled(CollapseAble)`
  ${FlexStretchMixin}
  padding: var(--jukebox-frame-gap);
`;
const HeaderBoxWrapper = styled(BoxWrapper)`
  padding-bottom: 0px;
  height: 200px;
  ${props =>
    props.isCollapsed &&
    `
    margin-top: calc(-200px - var(--jukebox-frame-gap));
  `}

  @media (max-width: 600px) {
    height: auto;
  }
`;
const FooterBoxWrapper = styled(BoxWrapper)`
  padding-top: 0px;
`;
const SidebarBoxWrapper = styled(BoxWrapper)`
  padding-right: 0px;
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  ${props =>
    props.isCollapsed &&
    `
    margin-left: calc(-200px - var(--jukebox-frame-gap));
  `}
  @media (max-width: 600px) {
    padding-right: var(--jukebox-frame-gap);
    padding-bottom: 0px;
    width: auto;
    min-width: auto;
    max-width: none;
  }
`;
const MainViewBoxWrapper = styled(BoxWrapper)`
  flex-grow: 1;
`;

interface Props {
  codeConfig: DefaultWebConfig;
  data: DataState;
  player: PlayerState;
  ui: UiState;
  setManager(manager: Manager): void;
  setCurrentTrack(track: PlayableTrack): void;
  setCurrentTrackList(trackList: PlayableTrackList): void;
  toggleCollapseHeader(): void;
  toggleCollapseRoot(): void;
  toggleCollapseSidebar(): void;
  toggleIsPlaying(): void;
  toggleIsShuffle(): void;
  toggleIsRepeat(): void;
  seekNextTrack(): void;
  seekPrevTrack(): void;
  setSeekByDelta(delta: number): void;
  setIsPlaying(isPlaying: boolean): void;
}
interface State {
  colorScheme: ColorScheme;
}

class App extends React.Component<Props, State> {
  webConfig = getWebConfig(this.props.codeConfig);
  state: State = {
    colorScheme: getColorScheme(this.webConfig.ColorScheme),
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
    // this also gets attached to the promise
    appWindow.JUKEBOX = {
      open: () => this.props.ui.collapseRoot && this.props.toggleCollapseRoot(),
      close: () =>
        !this.props.ui.collapseRoot && this.props.toggleCollapseRoot(),
      play: () => !this.props.player.isPlaying && this.props.toggleIsPlaying(),
      pause: () => this.props.player.isPlaying && this.props.toggleIsPlaying(),
    };
    Logger.log('JUKEBOX is ready');

    // read config
    if (this.webConfig.OnlyJukebox) {
      this.props.toggleCollapseRoot();
    }

    // setup listeners to only work when its fullscreen
    document.addEventListener('keydown', evt => {
      if (!this.props.ui.collapseRoot) {
        let match = true;
        switch (evt.code) {
          case 'ArrowLeft':
            this.props.seekPrevTrack();
            break;
          case 'ArrowRight':
            this.props.seekNextTrack();
            break;
          case 'Comma':
            this.props.setSeekByDelta(-10);
            break;
          case 'Period':
            this.props.setSeekByDelta(10);
            break;
          case 'Space':
            this.props.toggleIsPlaying();
            break;
          case 'KeyS':
            this.props.toggleIsShuffle();
            break;
          case 'KeyR':
            this.props.toggleIsRepeat();
            break;
          default:
            Logger.log(evt);
            match = false;
        }
        if (match) {
          evt.preventDefault();
        }
      }
    });

    // fetch data, start app
    Manager.fetch(this.webConfig)
      .then(manager => this.props.setManager(manager))
      .then(() => {
        const { manager } = this.props.data;
        if (manager && manager.playlists.length) {
          // return this.props.setCurrentTrackList(manager.playlists[1]);
          return this.props.setCurrentTrackList(manager.playlists[0]);
        }
      })
  }

  render() {
    const { data, player, ui } = this.props;
    const { colorScheme } = this.state;
    if (!data.manager) {
      return <h3> loading, please wait... </h3>;
    }

    const { webConfig } = this;
    return (
      <RootContainer colorScheme={colorScheme} isCollapsed={ui.collapseRoot}>
        <AudioElm />
        <RootInner>
          <Header>
            <HeaderBoxWrapper isCollapsed={ui.collapseHeader}>
              <Box>
                <CurrentTrackView />
                {webConfig.OnlyJukebox ? (
                  <CollapseBottom
                    onClick={this.props.toggleCollapseHeader}
                    isCollapsed={ui.collapseHeader}
                  />
                ) : (
                    <CollapseRoot
                      onClick={this.props.toggleCollapseRoot}
                      isCollapsed={false}
                    />
                  )}
              </Box>
            </HeaderBoxWrapper>
          </Header>
          <BodyContainer>
            {data.manager.playlists.length > 1 && (
              <SidebarBoxWrapper isCollapsed={ui.collapseSidebar}>
                <Box>
                  <PlaylistMenu />
                  {webConfig.OnlyJukebox && (
                    <CollapseSidebar
                      onClick={this.props.toggleCollapseSidebar}
                      isCollapsed={ui.collapseSidebar}
                    />
                  )}
                </Box>
              </SidebarBoxWrapper>
            )}
            <MainViewBoxWrapper>
              <Box>
                {player.browser ? (
                  <BrowserView />
                ) : (
                    player.trackList && <TrackListView />
                  )}
              </Box>
            </MainViewBoxWrapper>
          </BodyContainer>
          <Header>
            <FooterBoxWrapper>
              <Box>
                <ProgressBar />
                <PlaybackControls />
              </Box>
            </FooterBoxWrapper>
          </Header>
        </RootInner>
        <PopupAbout />
      </RootContainer>
    );
  }
}

export default connect(
  (state: MasterState) => ({
    data: state.data,
    player: state.player,
    ui: state.ui,
  }),
  {
    setManager,
    setCurrentTrack,
    setCurrentTrackList,
    toggleCollapseHeader,
    toggleCollapseRoot,
    toggleCollapseSidebar,
    toggleIsPlaying,
    toggleIsShuffle,
    toggleIsRepeat,
    seekNextTrack,
    seekPrevTrack,
    setSeekByDelta,
    setIsPlaying,
  },
)(App);
