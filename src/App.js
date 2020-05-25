import React from 'react';
import './App.scss';
import VideoContainer from "./components/VideoContainer";
import PeakWave from "./components/PeakWave";
import Subtitles from "./components/Subtitles";

function App() {
  return (
    <div className="App">
      <div className="App-header">
          <div className='app-top'>
              <Subtitles/>
              <VideoContainer/>
          </div>
          <div className='app-bottom'>
              <PeakWave/>
          </div>
            {/*<Waveform/>*/}
      </div>
    </div>
  );
}

export default App;
