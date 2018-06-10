import React from "react";
import PropTypes from "prop-types";

import AddServerBtn from "./AddServerBtn";
import AddDirectBtn from "../channel/AddDirectBtn";
import ServerList from "./ServerList";

const ServerSidebar = ({ servers, current }) => (
	<div className="col c1 centered server-sidebar">
		<AddDirectBtn />
		<div>Servers</div>
		<ServerList servers={servers} current={current} />
		<AddServerBtn />
	</div>
);

ServerSidebar.defaultProps = {
	current: ""
};

ServerSidebar.propTypes = {
	servers: PropTypes.arrayOf(
		PropTypes.shape({
			server: PropTypes.object
		})
	).isRequired,
	current: PropTypes.string
};

export default ServerSidebar;
