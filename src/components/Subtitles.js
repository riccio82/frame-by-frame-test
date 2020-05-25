import React, { Component } from 'react';
import { connect } from "react-redux";
import Subtitle from "./Subtitle";
import _ from 'lodash';

class Subtitles extends Component {


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.activeSubtitle !== this.props.activeSubtitle && !_.isUndefined(this.props.activeSubtitle) ) {
            this.scrollSubtitle(this.props.activeSubtitle);
        }
    }

    getSubtitles() {

        this.subtitlesRef = [];
        return this.props.subtitles.map((sub)=>{
            const ref = React.createRef();
            this.subtitlesRef[sub.get('id')]=ref;
            return <Subtitle ref={ref} key={sub.get('id')} subtitle={sub.toJS()} active={sub.get('id') == this.props.activeSubtitle}/>
        }
        );
    }

    scrollSubtitle = (id) => {
        this.subtitlesRef[id].current.ref.scrollIntoView( {
            behavior: 'smooth',
            block: 'center',
        });
    };


    render() {
        return ( <div className='subtitles-container'>
            <ul className='subtitles-list'>
                {this.getSubtitles()}
            </ul>
        </div> )
    }
}
const mapStateToProps = state => {
    const {videoState, seekTo, subtitles, activeSubtitle} = state;
    return {
        videoState,
        seekTo,
        subtitles,
        activeSubtitle
    };
};

export default connect(mapStateToProps)(Subtitles);