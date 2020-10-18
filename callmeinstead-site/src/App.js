import React, { Component } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import './App.css';

const Mp3Recorder = new MicRecorder({bitRate: 128});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
      blob: ''
    }
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
          console.log(this.state);
        }).catch((e) => console.error(e));
    }
  };

stop = () => {
  Mp3Recorder
    .stop()
    .getMp3()
    .then(([buffer, blob]) => {
      const blobURL = URL.createObjectURL(blob);
      this.setState({ blobURL, isRecording: false , blob});
      console.log(this.state);
      this.convertBlob();
    }).catch((e) => console.log(e));
};

componentDidMount() {
  navigator.getUserMedia({ audio: true },
    () => {
      console.log('Permission Granted');
      this.setState({ isBlocked: false });
    },
    () => {
      console.log('Permission Denied');
      this.setState({ isBlocked: true })
    },
  );
}

convertBlob() {
  var reader = new FileReader();
  reader.readAsDataURL(this.state.blob); 
  reader.onloadend = function() {
     var base64data = reader.result;                
     base64data = base64data.slice(22);
 }
}


render() {
  return (
    <div className="App">
      <header className="App-header">
      <p> Call Me Instead.</p>
      
          <button className='Record' onClick={this.start} disabled={this.state.isRecording}>R</button>
          <button className='Stop' onClick={this.stop} disabled={!this.state.isRecording}>Stop</button>
          <audio src={this.state.blobURL} controls="controls" type='audio/mp3'/>
          </header>
    </div>
  );
}
}


export default App;
