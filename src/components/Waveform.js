import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import {playVideo, stopVideo, seekVideo} from '../actions/actions';
import { WaveformContainer, Wave, WaveButtons, PlayButton } from './Waveform.styled';
import { connect } from 'react-redux'

class Waveform extends Component {
    state = {
        playing: false,
    };

    componentDidMount() {
        // const track = document.querySelector('#track');
        const url = 'public/video/video.mp4';
        // const url = 'https://zhw2590582.github.io/assets-cdn/video/your-name.mp4';
        this.waveform = WaveSurfer.create({
            container: '#waveform',
            height: 140,
            pixelRatio: 1,
            scrollParent: true,
            normalize: true,
            minimap: true,
            backend: 'MediaElement',
            cursorColor: 'red',
        });


        this.waveform.load(url);

        this.waveform.on('seek',  (time) =>{
            console.log(this.waveform.getCurrentTime() );
            this.props.seekVideo(time*this.waveform.getDuration());
        });
        this.waveform.on('play',  () =>{
            console.log("Pause Time ", this.waveform.getCurrentTime());
            this.props.seekVideo(this.waveform.getCurrentTime())
            this.props.playVideo();
        });
        this.waveform.on('pause',  () =>{
            console.log("Wave Pause Time ", this.waveform.getCurrentTime());
            this.props.stopVideo(this.waveform.getCurrentTime());
            this.props.seekVideo(this.waveform.getCurrentTime())
        });
    };

    handlePlay = () => {
        this.setState({ playing: !this.state.playing });
        this.waveform.playPause();

    };

    nextFrame = () => {
        let currentTime = this.waveform.getCurrentTime();
        let nextFrameTime = currentTime + parseFloat(parseFloat(1/24).toFixed(6)); //Frame rate di 30fps
        // this.waveform.seekTo(currentTime/this.waveform.getDuration());

        console.log("currentTime", currentTime);
        console.log("nextFrameTime", nextFrameTime);
        this.props.seekVideo(currentTime);
        this.waveform.play();
        this.waveform.setPlayEnd(nextFrameTime);
    };
    prevFrame = () => {
        let currentTime = this.waveform.getCurrentTime();
        let prevFrameTime = currentTime - parseFloat(parseFloat(2/24).toFixed(6)); //Frame rate di 30fps
        let stopFrame = currentTime - parseFloat(parseFloat(1/24).toFixed(6)); //Frame rate di 30fps
        // currentTime > 0 && this.waveform.seekTo(currentTime/this.waveform.getDuration());

        if ( prevFrameTime < 0 || stopFrame < 0 ) {

            this.waveform.seekTo(0);
        } else {
            this.waveform.seekTo(prevFrameTime/this.waveform.getDuration());
            this.waveform.play();
            this.waveform.setPlayEnd(stopFrame);

        }
        console.log("currentTime", prevFrameTime);
        console.log("nextFrameTime", stopFrame);


    };

    render() {


        return (
            <WaveformContainer>
                <Wave id="waveform" />
                <WaveButtons>
                    <PlayButton onClick={this.handlePlay} >
                        {!this.state.playing ? 'Play' : 'Pause'}
                    </PlayButton>
                    <PlayButton onClick={this.prevFrame} >
                        {'Prev Frame'}
                    </PlayButton>
                    <PlayButton onClick={this.nextFrame} >
                        {'Next Frame'}
                    </PlayButton>
                </WaveButtons>
                {/*<div id="wave-timeline" />*/}
            </WaveformContainer>
        );
    }
};

export default connect(
    null,
    { playVideo, stopVideo, seekVideo }
)(Waveform)