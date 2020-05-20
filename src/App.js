import React from 'react';
import Waveform from './components/Waveform';
import './App.scss';
import VideoContainer from "./components/VideoContainer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
            <VideoContainer/>
            <Waveform/>
      </header>
    </div>
  );
}

export default App;
