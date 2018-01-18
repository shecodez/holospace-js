import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List, Image, Popup } from 'semantic-ui-react';

const ServerList = ({ servers }) => (
	<List className="server-list">
		{servers.map(server => (
			<List.Item className="server" key={server._id}>
				<Link to={`/channels/${server._id}/${server.default_id}`}>
					<Popup
						trigger={<Image src={server.icon} />}
						content={server.name}
						position="right center"
					/>
				</Link>
			</List.Item>
		))}
	</List>
);

ServerList.propTypes = {
	servers: PropTypes.arrayOf(PropTypes.object).isRequired
	// isSelected: PropTypes.bool.isRequired
};

export default ServerList;
