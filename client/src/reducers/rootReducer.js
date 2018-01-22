import { combineReducers } from 'redux';

import locale from './locale';
import user from './user';
import servers from './servers';
import channels from './channels';
import memberships from './memberships';
// import messages from "./messages";

export default combineReducers({
	locale,
	user,
	servers,
	channels,
	memberships
	// messages
});
