import { MUTE, ALLOW_MIC, USE_VR } from './../actionTypes';

export const muted = value => ({
	type: MUTE,
	value
});

export const hotMic = value => ({
	type: ALLOW_MIC,
	value
});

export const setVR = value => ({
	type: USE_VR,
	value
});

// ------------------------------------------------

export const mute = value => dispatch =>
  dispatch(muted(value));

export const allowMic = value => dispatch =>
  dispatch(hotMic(value));

export const useVR = value => dispatch =>
  dispatch(setVR(value));
