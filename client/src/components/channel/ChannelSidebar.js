import React from "react";
import PropTypes from "prop-types";

import ServerHeader from "../server/ServerHeader";
import ChannelList from "./ChannelList";

const ChannelSidebar = ({ channels, current, server, owner }) => {
	return (
		<div className="col c2">
			<ServerHeader server={server} owner={owner} />
			<ChannelList channels={channels} current={current} />
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
