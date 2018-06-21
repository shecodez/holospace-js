import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import AddServerBtn from "./AddServerBtn";
import ProfileBtn from "../buttons/ProfileBtn";
import DirectBtn from "../buttons/DirectBtn";
import ServerList from "./ServerList";

const ServerSidebar = ({ servers, current, direct }) => (
	<div className="col c1 centered server-sidebar">
		{direct ? <ProfileBtn /> : <DirectBtn />}
		<div>
			<FormattedMessage
				id="server.ServerSidebar.servers"
				defaultMessage="Servers"
			/>
		</div>
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
