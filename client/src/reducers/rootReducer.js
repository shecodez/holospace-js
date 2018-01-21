import { combineReducers } from 'redux';

import user from './user';
import servers from './servers';
import channels from './channels';
import memberships from './memberships';
// import messages from "./messages";

export default combineReducers({
	user,
	servers,
	channels,
	memberships
	// messages
});
