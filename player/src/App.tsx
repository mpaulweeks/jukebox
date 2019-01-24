import React from 'react';
import jsmediatags from 'jsmediatags';
import { FILE_ROOT } from './constants';


export default class App extends React.Component {
  state = {
    info: undefined,
    loaded: undefined,
  };

  componentDidMount() {
    // const source = `${FILE_ROOT}/claire_de_lune.mp3`;
    const source = `${FILE_ROOT}/slimegirls_warpstar.mp3`;
    // const source = `${FILE_ROOT}/robgasser_move.mp3`;
    // const source = 'https://s3.amazonaws.com/jsmediatags-offset-issue/audio.mp3';

    // todo store in audio obj, only display inteface
    this.setState({
      loaded: source,
    });

    new jsmediatags
      .Reader(source)
      .setTagsToRead(["title", "year", "album", "year", "genre", "picture"])
      .read({
        onSuccess: data => {
          console.log(data);
          this.setState({
            info: JSON.stringify(data),
          });
        },
        onError: error => {
          console.log(error);
          this.setState({
            info: JSON.stringify(error),
          });
        },
      });
  }

  render() {
    const { info, loaded } = this.state;
    return (
      <div>
        {info && (
          <h3>{info}</h3>
        )}
        {loaded && (
          <audio controls src={loaded}></audio>
        )}
      </div>
    );
  }
}
