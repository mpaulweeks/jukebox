import React from 'react';
import { PlayerState } from "../redux/reducers/player";
import { MasterState } from '../redux/reducers';
import { setCurrentTrack, toggleIsPlaying, seekNextTrack, seekPrevTrack } from '../redux/actions';
import { connect } from 'react-redux';
import { PlayableTrack } from 'jukebox-utils';

interface Props {
  player: PlayerState,
  setCurrentTrack(track: PlayableTrack): void,
  toggleIsPlaying(): void,
  seekNextTrack(): void,
  seekPrevTrack(): void,
}
class AudioElm extends React.Component<Props> {
  audioElm = new Audio();
  componentDidMount() {
    const { audioElm } = this;

    // setup listeners
    // todo only apply to jukebox div
    document.addEventListener('keydown', evt => {
      evt.preventDefault();
      switch (evt.code) {
        case 'ArrowLeft':
          return this.props.seekPrevTrack();
        case 'ArrowRight':
          return this.props.seekNextTrack();
        case 'Space':
          return this.props.toggleIsPlaying();
        default:
        // Logger.log(evt);
      }
    });
    audioElm.addEventListener('ended', () => this.onTrackEnd());

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
    const { isPlaying, track } = this.props.player;
    if (track && track !== prevProps.player.track) {
      audioElm.src = track.audioSrc;
    }
    if (isPlaying) {
      audioElm.play();
    } else {
      audioElm.pause();
    }
  }

  onTrackEnd = (keyboardEvent?: any) => {
    const { player } = this.props;
    if (player.repeat) {
      this.audioElm.play()
    } else {
      this.props.seekNextTrack();
    }
  }

  render() {
    return '';
  }
}

export default connect((state: MasterState) => ({
  player: state.player,
}), {
    setCurrentTrack,
    toggleIsPlaying,
    seekNextTrack,
    seekPrevTrack,
  })(AudioElm);
