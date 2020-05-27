import { PLAY_VIDEO, STOP_VIDEO, SEEK, SEEK_SUB } from '../actions/actions'
import subtitleObj from '../../public/video/subtitle_ita';
import videoCtm from '../../public/video/videoCtm.json';
import Immutable from 'immutable';

const initialState = {
    videoState: STOP_VIDEO,
    seekTo: null,
    subtitles: Immutable.fromJS(subtitleObj),
    activeSubtitle: 0,
    videoCtm: videoCtm
};
function findActiveSubtitle(subtitles, seek) {
    const subtitle = subtitles.find((sub)=> (sub.get('start') <= seek && sub.get('end') >= seek) );
    return (subtitle ? subtitle.get('id') : undefined)
}
function initApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState
    }
    switch (action.type) {
        case PLAY_VIDEO:
            return Object.assign({}, state,{
                videoState: action.type,
                seekTo: undefined,

                });
        case STOP_VIDEO:
            return Object.assign({}, state,{
                    videoState: action.type,
                    seekTo: action.seek
                });
        case SEEK:
            return Object.assign({}, state,{
                videoState: state.videoState,
                seekTo: action.seek,
                activeSubtitle: findActiveSubtitle(state.subtitles, action.seek)
            });
        case SEEK_SUB:
            return Object.assign({}, state,{
                activeSubtitle: findActiveSubtitle(state.subtitles, action.seek)
            });
        default:
            return state
    }
}

export default initApp;