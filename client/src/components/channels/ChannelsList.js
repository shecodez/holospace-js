import React from "react";
import PropTypes from "prop-types";
import { List } from "semantic-ui-react";

// components
import ChannelListItem from "./ChannelListItem";
import DirectChannelListItem from "./DirectChannelListItem";

const ChannelsList = ({ channels, socket }) => (
	<List className="channel-list">
		{channels.map(
			channel =>
				channel.direct ? (
					<DirectChannelListItem
						channel={channel}
						key={channel._id}
						socket={socket}
					/>
				) : (
					<ChannelListItem
						channel={channel}
						key={channel._id}
						socket={socket}
					/>
				)
		)}
	</List>
);

ChannelsList.propTypes = {
	channels: PropTypes.arrayOf(PropTypes.object).isRequired,
	socket: PropTypes.shape({}).isRequired
};

export default ChannelsList;
