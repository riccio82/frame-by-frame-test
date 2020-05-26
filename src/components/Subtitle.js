import React, { Component } from 'react';
import _ from 'lodash';


class Subtitle extends Component {

    sToTime = (duration) => {
        var milliseconds = parseInt((duration%1000))
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }
    render() {
        const {subtitle, active} = this.props;
        return ( <li ref={(ref)=>this.ref=ref} className={'subtitle ' + (active ? " active": "")}>
            <div className={'start-time'}>{this.sToTime(subtitle.start * 1000)}</div>
            <div className={'end-time'}>{this.sToTime(subtitle.end * 1000 )}</div>
            <div className={'id'}>{subtitle.id}</div>
            <div  className={'content'}>
                {_.map(subtitle.content, (c,i)=><p key={i}>{c}</p>)}</div>
        </li> )
    }
}


export default Subtitle;