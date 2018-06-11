import React from "react";
import PropTypes from "prop-types";

import ServerHeader from "../server/ServerHeader";
import ChannelList from "./ChannelList";

const ChannelSidebar = ({ channels, current, server, owner, direct }) => {
	return (
		<div className="col c2">
			<ServerHeader server={server} owner={owner} direct={direct} />
			<ChannelList
				channels={channels}
				current={current}
				direct={direct}
			/>
		</div>
	);
};

ChannelSidebar.defaultProps = {
	current: "",
	server: null,
	owner: false
};

ChannelSidebar.propTypes = {
	channels: PropTypes.arrayOf(
		PropTypes.shape({
			channel: PropTypes.object
		})
	).isRequired,
	current: PropTypes.string,
	server: PropTypes.shape({
		name: PropTypes.string
	}),
	owner: PropTypes.bool
};

export default ChannelSidebar;
