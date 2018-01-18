import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { fetchMemberServers } from './../../actions/memberships';

import ServerList from './ServerList';
import AddServer from './AddServer';

class Servers extends React.Component {
	componentDidMount() {
		this.props.fetchMemberServers();
	}

	render() {
		const { servers } = this.props;

		return (
			<div className="servers">
				<Header as="h5" inverted textAlign='center'>
					Servers
				</Header>

				<ServerList servers={servers} />

				<AddServer />
			</div>
		);
	}
}

Servers.propTypes = {
	servers: PropTypes.arrayOf(
		PropTypes.shape({
			server: PropTypes.object
		})
	).isRequired,
	fetchMemberServers: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		servers: state.servers
	};
}

export default connect(mapStateToProps, { fetchMemberServers })(Servers);
