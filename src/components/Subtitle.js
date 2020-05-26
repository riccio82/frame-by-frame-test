import React, { Component } from 'react';
import _ from 'lodash';


class Subtitle extends Component {

    render() {
        const {subtitle, active} = this.props;
        return ( <li ref={(ref)=>this.ref=ref} className={'subtitle ' + (active ? " active": "")}>
            {subtitle.content.join()}</li> )
    }
}


export default Subtitle;