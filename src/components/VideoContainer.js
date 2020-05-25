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
        return ( <div id="video-container" data-state={this.props.videoState}>
            <ReactPlayer
                ref={(video)=>this.video=video}
                url='public/video/video.mp4'
                playing={this.props.videoState === PLAY_VIDEO }
                config={{ file: {
                        tracks: [
                            {kind: 'subtitles', src: 'public/video/subtitle.vtt', srcLang: 'en', default: true}
                        ]
                    }}}
                controls={false}
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