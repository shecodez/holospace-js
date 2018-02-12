import { combineReducers } from 'redux';

import locale from './locale';
import user from './user';
import servers from './servers';
import memberships from './memberships';
import channels from './channels';
import subscriptions from './subscriptions';
import messages from './messages';
import permissions from './permissions';

export default combineReducers({
	locale,
	user,
	servers,
	memberships,
	channels,
	subscriptions,
	messages,
	permissions
});
