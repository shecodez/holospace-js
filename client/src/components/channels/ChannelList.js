import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

// components
import Channel from './Channel';

const ChannelList = ({ channels }) => (
	<List className="channel-list">
		{channels.map(channel => <Channel channel={channel} key={channel._id} />)}
	</List>
);

ChannelList.propTypes = {
	channels: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ChannelList;
