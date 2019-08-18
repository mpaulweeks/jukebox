import React from 'react';
import {
  Manager,
  PlayableTrack,
  PlayableTrackList,
  Constants,
  DefaultWebConfig,
  getWebConfig,
  Logger,
  ColorScheme,
} from 'jukebox-utils';
import TrackListView from './TrackListView';
import CurrentTrackView from './CurrentTrackView';
import PlaylistMenu from './PlaylistMenu';
import styled from 'styled-components';
import BrowserView from './BrowserView';
import { CollapseRoot, CollapseBottom, CollapseSidebar } from './components/Collapse';
import { CollapseAble, FlexStretchMixin, Box } from './components/Common';
import PlaybackControls from './components/PlaybackControls';
import { getColorScheme } from './ColorScheme';
import {
  setManager,
  setVolume,
  setCurrentTrack,
  setCurrentTrackList,
  toggleCollapseHeader,
  toggleCollapseRoot,
  toggleCollapseSidebar,
  togglePopupAbout,
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
import PopupImage from './components/PopupImage';
import PopupSearch from './components/PopupSearch';
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
  --jukebox-sidebar-width: 200px;

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
  max-height: 100%;

  background-color: var(--jukebox-background);
  color: var(--jukebox-foreground);
`;

const Header = styled.div``;
const BodyContainer = styled.div`
  ${FlexStretchMixin}
  flex-direction: row;
  overflow: hidden;

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
  ${props =>
    props.isCollapsed &&
    `
    margin-top: calc(0px - (var(--jukebox-sidebar-width) + 2 * (var(--jukebox-frame-gap) + var(--jukebox-border-width))));
  `}
`;
const FooterBoxWrapper = styled(BoxWrapper)`
  padding-top: 0px;
`;
const SidebarBoxWrapper = styled(BoxWrapper)`
  padding-right: 0px;
  width: var(--jukebox-sidebar-width);
  min-width: var(--jukebox-sidebar-width);
  max-width: var(--jukebox-sidebar-width);
  ${props =>
    props.isCollapsed &&
    `
    margin-left: calc(0px - (var(--jukebox-sidebar-width) + var(--jukebox-frame-gap)));
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
  setVolume(volume: number): void;
  setCurrentTrack(track: PlayableTrack): void;
  setCurrentTrackList(trackList: PlayableTrackList): void;
  toggleCollapseHeader(): void;
  toggleCollapseRoot(): void;
  toggleCollapseSidebar(): void;
  togglePopupAbout(): void;
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

interface KeysHeld {
  [code: string]: boolean;
};

class App extends React.Component<Props, State> {
  webConfig = getWebConfig(this.props.codeConfig);
  state: State = {
    colorScheme: getColorScheme(this.webConfig),
  };
  keysHeld: KeysHeld = {};

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
    if (this.webConfig.onlyJukebox) {
      this.props.toggleCollapseRoot();
    }

    window.addEventListener('focus', evt => {
      // tabbing back over, forget any held keys
      this.keysHeld = {};
    });
    document.addEventListener('keyup', evt => {
      delete this.keysHeld[evt.code];
    });
    document.addEventListener('keydown', evt => {
      const { keysHeld } = this;
      keysHeld[evt.code] = true;
      if (this.props.ui.collapseRoot || this.props.ui.showPopupSearch) {
        // if not fullscreen OR search is open, ignore any pressed keys
        return;
      }
      const ignoreKeys = [
        'ControlLeft',
        'ControlRight',
        'MetaLeft',
        'MetaRight',
        'AltLeft',
        'AltRight',
      ];
      if (ignoreKeys.some(code => keysHeld[code])) {
        return;
      }
      let match = true;
      switch (evt.code) {
        case 'Escape':
          if (this.props.ui.showPopupAbout) {
            this.props.togglePopupAbout();
          } else if (!this.webConfig.onlyJukebox) {
            this.props.toggleCollapseRoot();
          }
          break;
        case 'Equal':
          this.props.setVolume(this.props.player.volume + 0.1);
          break;
        case 'Minus':
          this.props.setVolume(this.props.player.volume - 0.1);
          break;
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
      return null;
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
                {webConfig.onlyJukebox ? (
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
                  {webConfig.onlyJukebox && (
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
        <PopupImage />
        <PopupSearch />
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
    setVolume,
    setCurrentTrack,
    setCurrentTrackList,
    toggleCollapseHeader,
    toggleCollapseRoot,
    toggleCollapseSidebar,
    togglePopupAbout,
    toggleIsPlaying,
    toggleIsShuffle,
    toggleIsRepeat,
    seekNextTrack,
    seekPrevTrack,
    setSeekByDelta,
    setIsPlaying,
  },
)(App);
