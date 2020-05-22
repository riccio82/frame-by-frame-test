import React from 'react';
import './App.scss';
import VideoContainer from "./components/VideoContainer";
import PeakWave from "./components/PeakWave";

function App() {
  return (
    <div className="App">
      <header className="App-header">
            <VideoContainer/>
            {/*<Waveform/>*/}
            <PeakWave/>
      </header>
    </div>
  );
}

export default App;
