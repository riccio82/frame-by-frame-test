import React, { Component } from 'react';
import {playVideo, stopVideo, seekVideo, seekSubtitle} from '../actions/actions';
import { connect } from 'react-redux'
import Peaks from 'peaks.js';
import _ from "lodash";
import {PlayButton, WaveButtons} from "./PeakWave.styled";
import CustomSegmentMarker from "./CustomSegmentMarker";

class PeakWave extends Component {


    state = {
        playing: false,
    };

    generateSubtitleSegments = () => {
        let segments = [];
        this.props.subtitlesObj.forEach((subI)=>{
            const sub = subI.toJS();
            segments.push({
                startTime: sub.start,
                endTime: sub.end,
                id: sub.id,
                labelText: sub.id,
                editable: true,
                color: '#5e5e5e',
                sub: sub
            })
        });
        return segments;
    };
    generateCtmSegments = () => {
        let segments = [];
        this.props.videoCtm.forEach((ctm)=>{
            segments.push({
                startTime: ctm.start,
                endTime: ctm.end,
                id: "CTM:" +ctm.id,
                labelText: "CTM:"+ ctm.id,
                editable: true,
                color: 'rgba(94,94,94,0.46)',
                ctm: ctm
            })
        });
        return segments;
    };

    createSegmentMarker = (options) => {
        if (options.view === 'zoomview') {
            return new CustomSegmentMarker(options);
        }

        // return null;
    }


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
            containers: {
                zoomview: document.getElementById('zoomview-container'),
            },
            mediaElement: this.audiography.audioElement,
            dataUri:  {
                arraybuffer: 'public/video/video.dat',
                json: 'public/video/audiowave.json'

            },
            zoomLevels: [256],
            // keyboard: true,
            segments: this.generateSubtitleSegments(),
            createSegmentMarker: this.createSegmentMarker
        }, (err, peaksInstance)=> {
            if (err) {
                console.error(err.message);
                return;
            }
            const view = this.peak.views.getView('zoomview');
            view.setWaveformColor('rgba(94,94,94,0.46)');
            view.setTimeLabelPrecision(3);
            view.setAmplitudeScale(0.75);
            const ctmObj = this.generateCtmSegments();
            ctmObj.forEach((seg)=>{
                peaksInstance.segments.add(seg);
            });

            // const container = document.getElementsByClassName('overview-container');
            // container[0].style.display = 'none';
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
                <div id={'waveform-container'}>
                    <div id="zoomview-container"/>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    const {subtitles, videoCtm} = state;
    return {
        subtitlesObj: subtitles,
        videoCtm
    };
};

export default connect(
    mapStateToProps,
    { playVideo, stopVideo, seekVideo, seekSubtitle }
)(PeakWave)