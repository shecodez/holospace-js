import React from "react";
import PropTypes from "prop-types";

import AddServerBtn from "./AddServerBtn";
import ProfileBtn from "../user/ProfileBtn";
import AddDirectBtn from "../channel/AddDirectBtn";
import ServerList from "./ServerList";

const ServerSidebar = ({ servers, current, direct }) => (
	<div className="col c1 centered server-sidebar">
		{direct ? <ProfileBtn /> : <AddDirectBtn />}
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
