/*
 * action types
 */

export const PLAY_VIDEO = 'PLAY_VIDEO';
export const STOP_VIDEO = 'STOP_ACTION';
export const SEEK = 'SEEK';
export const SEEK_SUB = 'SEEK_SUB';

/*
 * action creators
 */

export function playVideo() {
    return { type: PLAY_VIDEO }
}

export function stopVideo(time) {
    return { type: STOP_VIDEO, seek: time }
}

export function seekVideo(time) {
    return { type: SEEK, seek: time }
}

export function seekSubtitle(time) {
    return { type: SEEK_SUB, seek: time }
}