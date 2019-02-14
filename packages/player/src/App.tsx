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
  setCurrentTrack,
  setCurrentTrackList,
} from './redux/actions';
import { connect } from 'react-redux';
import { PlayerState } from './redux/reducers/player';
import { MasterState } from './redux/reducers';
import AudioElm from './components/AudioElm';

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
  player: PlayerState,
  setCurrentTrack(track: PlayableTrack): void,
  setCurrentTrackList(trackList: PlayableTrackList): void,
};
interface State {
  manager?: Manager,
  colorScheme: ColorScheme,
  settings: PlayerSettings,
  collapseRoot: boolean,
  collapseHeader: boolean,
  collapseSidebar: boolean,
};

class App extends React.Component<Props, State> {
  webConfig = getWebConfig(this.props.codeConfig);
  state: State = {
    manager: undefined,
    colorScheme: getColorScheme(this.webConfig.ColorScheme),
    settings: {
      isPlaying: false,
      repeat: false,
      shuffle: false,
    },
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

    // fetch data, start app
    Manager.fetch(this.webConfig).then(manager => this.setState({
      manager: manager,
    }, () => {
      if (manager.playlists.length) {
        this.props.setCurrentTrackList(manager.playlists[0]);
      }
    }));
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
    const { manager, colorScheme, settings, collapseRoot, collapseHeader, collapseSidebar } = this.state;
    const { browser } = this.props.player;
    if (!manager) {
      return (
        <h3> loading, please wait... </h3>
      );
    }

    const { webConfig } = this;
    return (
      <RootContainer isCollapsed={collapseRoot}>
        <AudioElm />
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
                    manager={manager}
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
                {browser ? (
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
  player: state.player,
}), {
    setCurrentTrack,
    setCurrentTrackList,
  })(App);
