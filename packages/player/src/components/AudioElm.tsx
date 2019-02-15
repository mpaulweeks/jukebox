import React from 'react';
import { PlayerState } from '../redux/reducers/player';
import { MasterState } from '../redux/reducers';
import {
  setCurrentTrack,
  toggleIsPlaying,
  seekNextTrack,
  seekPrevTrack,
} from '../redux/actions';
import { connect } from 'react-redux';
import { PlayableTrack } from 'jukebox-utils';

interface Props {
  player: PlayerState;
  setCurrentTrack(track: PlayableTrack): void;
  seekNextTrack(): void;
}
class AudioElm extends React.Component<Props> {
  private audioElm = new Audio();

  componentDidMount() {
    const { audioElm } = this;

    // setup listeners
    audioElm.addEventListener('ended', this.onTrackEnd);

    // load fonts for audio symbols
    [
      // https://stackoverflow.com/a/27053825
      'https://fonts.googleapis.com/icon?family=Material+Icons',
    ].forEach(fontSrc => {
      const linkElm = document.createElement('link');
      linkElm.setAttribute('rel', 'stylesheet');
      linkElm.setAttribute('href', fontSrc);
      document.head.appendChild(linkElm);
    });
  }
  componentDidUpdate(prevProps: Props) {
    const { audioElm } = this;
    const { track } = this.props.player;
    if (track && track !== prevProps.player.track) {
      audioElm.src = track.audioSrc;
    }
    this.ensurePlaying();
  }

  private ensurePlaying = () => {
    const { audioElm } = this;
    const { isPlaying } = this.props.player;
    if (isPlaying) {
      audioElm.play();
    } else {
      audioElm.pause();
    }
  }
  private onTrackEnd = (keyboardEvent?: any) => {
    const { player } = this.props;
    if (player.repeat) {
      this.audioElm.play();
    } else {
      this.props.seekNextTrack();
    }
  };

  render() {
    return '';
  }
}

export default connect(
  (state: MasterState) => ({
    player: state.player,
  }),
  {
    setCurrentTrack,
    seekNextTrack,
  },
)(AudioElm);
