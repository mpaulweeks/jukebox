import React from 'react';
import { Manager, PlaylistBrowser, PlayableTrack, PlayerSettings, PlayableTrackList, Logger, Constants, DefaultWebConfig, getWebConfig } from 'jukebox-utils';
import TrackListView from './TrackListView';
import CurrentTrackView from './CurrentTrackView';
import PlaylistMenu from './PlaylistMenu';
import styled from 'styled-components';
import BrowserView from './BrowserView';
import { CollapseRoot, CollapseBottom, CollapseSidebar } from './Collapse';
import { CollapseAble, FlexStretchMixin, ResetMixin } from './Components';
import PlaybackControls from './PlaybackControls';
import { ColorScheme, getColorScheme } from './ColorScheme';
import {
  setManager,
  setCurrentTrack,
  setCurrentTrackList,
  toggleCollapseHeader,
  toggleCollapseRoot,
  toggleCollapseSidebar,
  toggleIsPlaying, seekNextTrack, seekPrevTrack
} from './redux/actions';
import { connect } from 'react-redux';
import { PlayerState } from './redux/reducers/player';
import { MasterState } from './redux/reducers';
import AudioElm from './components/AudioElm';
import { UiState } from './redux/reducers/ui';
import { DataState } from './redux/reducers/data';

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
  data: DataState,
  player: PlayerState,
  ui: UiState,
  setManager(manager: Manager): void,
  setCurrentTrack(track: PlayableTrack): void,
  setCurrentTrackList(trackList: PlayableTrackList): void,
  toggleCollapseHeader(): void,
  toggleCollapseRoot(): void,
  toggleCollapseSidebar(): void,
  toggleIsPlaying(): void,
  seekNextTrack(): void,
  seekPrevTrack(): void,
};
interface State {
  colorScheme: ColorScheme,
};

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
    appWindow.JUKEBOX = {
      toggle: this.props.toggleCollapseRoot,
    };

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
          case 'Space':
            this.props.toggleIsPlaying();
            break;
          default:
            // Logger.log(evt);
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
          return this.props.setCurrentTrackList(manager.playlists[0]);
        }
      })
  }

  render() {
    const { data, player, ui } = this.props;
    const { colorScheme } = this.state;
    if (!data.manager) {
      return (
        <h3> loading, please wait... </h3>
      );
    }

    const { webConfig } = this;
    return (
      <RootContainer isCollapsed={ui.collapseRoot}>
        <AudioElm />
        <RootInner colorScheme={colorScheme}>
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
                    <TrackListView />
                  )}
              </Box>
            </MainViewBoxWrapper>
          </BodyContainer>
          <Header>
            <FooterBoxWrapper>
              <Box>
                <PlaybackControls />
              </Box>
            </FooterBoxWrapper>
          </Header>
        </RootInner>
      </RootContainer>
    )
  }
}

export default connect((state: MasterState) => ({
  data: state.data,
  player: state.player,
  ui: state.ui,
}), {
    setManager,
    setCurrentTrack,
    setCurrentTrackList,
    toggleCollapseHeader,
    toggleCollapseRoot,
    toggleCollapseSidebar,
    toggleIsPlaying,
    seekNextTrack,
    seekPrevTrack,
  })(App);
