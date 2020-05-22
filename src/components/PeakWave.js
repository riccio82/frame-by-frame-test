import React, { Component } from 'react';
import {playVideo, stopVideo, seekVideo, PLAY_VIDEO} from '../actions/actions';
import { connect } from 'react-redux'
import Peaks from 'peaks.js';
import _ from "lodash";
import {PlayButton, WaveButtons} from "./Waveform.styled";
import subtitleObj from './subtitle';

class PeakWave extends Component {


    state = {
        playing: false,
    };

    generateSegments = () => {
        let segments = [];
        _.forEach(subtitleObj, (sub)=>{
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
        console.log(subtitleObj);
        this.audiography = {
            audioElement: document.querySelector('#audio-element'),
            currentSegmentToAdd: '',
            playAudio: ()=>{
                if(this.audiography.audioElement.paused){
                    this.audiography.audioElement.play()
                }
            },
            playPauseAudio: ()=>{
                if(this.audiography.audioElement.paused){
                    this.audiography.audioElement.play();
                    this.props.playVideo();
                } else {
                    this.audiography.audioElement.pause();
                    this.props.stopVideo();
                }
            },
            pauseAudio: ()=>{
                if(!this.audiography.audioElement.paused){
                    this.audiography.audioElement.pause()
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
            // zoomLevels: [256],
            segments: this.generateSegments()
        }, (err)=> {
                // audiography.playAudio()
            });

        this.peak.on('player.seeked', (time)=>this.props.seekVideo(time))
    };

    handlePlay = () => {
        this.setState({ playing: !this.state.playing });
        this.audiography.playPauseAudio()

    };

    nextFrame = () => {
        let currentTime = this.peak.player.getCurrentTime();
        let nextFrameTime = currentTime + parseFloat(parseFloat(1/24).toFixed(6)); //Frame rate di 30fps
        // this.waveform.seekTo(currentTime/this.waveform.getDuration());

        console.log("currentTime", currentTime);
        console.log("nextFrameTime", nextFrameTime);
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

                <audio id={'audio-element'} src={'../../public/video/video.mp3'}/>
                <div id={'waveform-container'}/>

            </div>
        );
    }
}

export default connect(
    null,
    { playVideo, stopVideo, seekVideo }
)(PeakWave)