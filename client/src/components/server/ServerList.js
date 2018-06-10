import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Popup } from "semantic-ui-react";

import Avatar from "../layouts/Avatar";
// import { servers } from "../../utils/mock";

const ServerList = ({ servers, current }) => (
	<div className="server-list">
		{servers.map(server => (
			<div
				key={server._id}
				style={{ margin: ".5em auto" }}
				className={`server ${current === server._id ? "current" : ""}`}
			>
				<Link to={`/channels/${server._id}/${server.default_id}`}>
					<Popup
						position="right center"
						content={server.name}
						trigger={
							<Avatar icon={server.icon} name={server.name} />
						}
					/>
				</Link>
			</div>
		))}
	</div>
);

ServerList.defaultProps = {
	current: ""
};

ServerList.propTypes = {
	servers: PropTypes.arrayOf(PropTypes.object).isRequired,
	current: PropTypes.string
};

export default ServerList;
