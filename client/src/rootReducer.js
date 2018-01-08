import { combineReducers } from 'redux';

import user from './reducers/user';
// import servers from "./reducers/servers";
// import channels from "./reducers/channels";
// import memberships from "./reducers/memberships";
// import messages from "./reducers/messages";

export default combineReducers({
	user
	// servers,
	// channels,
	// memberships,
	// messages
});
