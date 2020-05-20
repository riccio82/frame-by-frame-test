import { PLAY_VIDEO, STOP_VIDEO, SEEK } from '../actions/actions'

const initialState = {
    videoState: STOP_VIDEO
};

function initApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState
    }
    switch (action.type) {
        case PLAY_VIDEO:
            return {
                    videoState: action.type
                };
        case STOP_VIDEO:
            return {
                    videoState: action.type
                };
        case SEEK:
            return {
                videoState: state.videoState,
                seekTo: action.seek
            };
        default:
            return state
    }
}

export default initApp;