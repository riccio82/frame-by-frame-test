import React, { Component } from 'react';
import {playVideo, stopVideo, seekVideo, seekSubtitle, PLAY_VIDEO} from '../actions/actions';
import { connect } from 'react-redux'
import Peaks from 'peaks.js';
import _ from "lodash";
import {PlayButton, WaveButtons} from "./PeakWave.styled";

class PeakWave extends Component {


    state = {
        playing: false,
    };

    generateSegments = () => {
        let segments = [];
        this.props.subtitlesObj.forEach((subI)=>{
            const sub = subI.toJS();
            segments.push({
                startTime: sub.start,
                endTime: sub.end,
                id: sub.id,
                labelText: sub.content[0],
                editable: true
            })
        });
        return segments;
    };

    componentDidMount() {
        this.audiography = {
            audioElement: document.querySelector('#audio-element'),
            currentSegmentToAdd: '',
            playPauseAudio: ()=>{
                if(this.audiography.audioElement.paused){
                    this.audiography.audioElement.play();
                    this.props.playVideo();
                } else {
                    this.audiography.audioElement.pause();
                    this.props.stopVideo();
                }
            },
            seek: (time)=>{
                console.log(this.audiography.audioElement.duration);
                this.audiography.audioElement.currentTime = time;
                this.props.seekVideo(time);
                console.log(this.audiography.audioElement.currentTime);
            },
        };

        this.peak = Peaks.init({
            container: document.querySelector('#waveform-container'),
            mediaElement: this.audiography.audioElement,
            dataUri:  {
                arraybuffer: 'public/video/video.dat'
            },
            zoomLevels: [512],
            segments: this.generateSegments(),
        }, (err)=> {
            const view = this.peak.views.getView('zoomview');
            view.setWaveformColor('#5e5e5e');
            const container = document.getElementsByClassName('overview-container');
            container[0].style.display = 'none';
        });

        this.peak.on('player.seeked', (time)=>this.props.seekVideo(time));

        this.peak.on('player.timeupdate', (time)=>this.props.seekSubtitle(time));


    };

    handlePlay = () => {
        this.setState({ playing: !this.state.playing });
        this.audiography.playPauseAudio()

    };

    nextFrame = () => {
        let currentTime = this.peak.player.getCurrentTime();
        let nextFrameTime = currentTime + parseFloat(parseFloat(1/24).toFixed(6)); //Frame rate di 30fps

        this.peak.segments.add({
            startTime: currentTime,
            endTime: nextFrameTime,
            id: 'audio1',
        });
        const segment = this.peak.segments.getSegment('audio1');
        this.props.seekVideo(currentTime);
        this.peak.player.playSegment(segment);
        this.peak.segments.removeById('audio1');

    };
    prevFrame = () => {
        let currentTime = this.peak.player.getCurrentTime();
        let startFrame = currentTime - parseFloat(parseFloat(2/24).toFixed(6)); //Frame rate di 30fps
        let stopFrame = currentTime - parseFloat(parseFloat(1/24).toFixed(6)); //Frame rate di 30fps
        if ( startFrame < 0 || stopFrame < 0 ) {

            this.props.seekVideo(0);
        } else {
            this.peak.segments.add({
                startTime: startFrame,
                endTime: stopFrame,
                id: 'audio1',
            });
            const segment = this.peak.segments.getSegment('audio1');
            this.props.seekVideo(startFrame);
            this.peak.player.playSegment(segment);
            this.peak.segments.removeById('audio1');

        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {


        return (<div className={'peak-container'}>
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

                <audio id={'audio-element'} src={'public/video/video.mp3'}/>
                <div id={'waveform-container'}/>

            </div>
        );
    }
}

const mapStateToProps = state => {
    const {subtitles} = state;
    return {
        subtitlesObj: subtitles
    };
};

export default connect(
    mapStateToProps,
    { playVideo, stopVideo, seekVideo, seekSubtitle }
)(PeakWave)