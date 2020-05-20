import React, { Component } from 'react';
import { connect } from "react-redux";
import ReactPlayer from 'react-player'
import {PLAY_VIDEO} from '../actions/actions'
import _ from 'lodash';

class VideoContainer extends Component {


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.seekTo !== this.props.seekTo && !_.isUndefined(this.props.seekTo) ) {
            this.video.seekTo(this.props.seekTo, 'seconds');
        }
    }

    render() {
        return ( <div id="video-container">
            <ReactPlayer
                url='/public/video/1700508311.mp4'
                playing={this.props.videoState === PLAY_VIDEO }
                controls={false} ref={(video)=>this.video=video}
                muted={true}
                progressInterval={10}
                // onProgress={(data)=>console.log("Played", data.playedSeconds)}
                onPause={()=>console.log("Video Pause", this.video.getCurrentTime())}
            />
        </div> )
    }
}
const mapStateToProps = state => {
    const {videoState, seekTo} = state;
    return {
        videoState,
        seekTo
    };
};

export default connect(mapStateToProps)(VideoContainer);