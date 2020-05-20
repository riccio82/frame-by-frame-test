/*
 * action types
 */

export const PLAY_VIDEO = 'PLAY_VIDEO'
export const STOP_VIDEO = 'STOP_TODO'
export const SEEK = 'SEEK'

/*
 * action creators
 */

export function playVideo() {
    return { type: PLAY_VIDEO }
}

export function stopVideo() {
    return { type: STOP_VIDEO }
}

export function seekVideo(time) {
    return { type: SEEK, seek: time }
}