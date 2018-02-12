import { MUTE, ALLOW_MIC, USE_VR } from './../actionTypes';

const initialState = {
  muted: false,
  allowMic: false,
  useVR: false
}

export default function permissions(state = initialState, action = {}) {
	switch (action.type) {
		case MUTE:
			return { ...state, muted: action.value };
    case ALLOW_MIC:
			return { ...state, allowMic: action.value };
    case USE_VR:
			return { ...state, useVR: action.value };
		default:
			return state;
	}
}
