import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';
import { fetchMemberServers } from './../../actions/memberships';

import ServerList from './ServerList';
import AddServer from './AddServer';

class Servers extends React.Component {
	componentDidMount() {
		this.props.fetchMemberServers();
	}

	render() {
		const { servers, currentServerId } = this.props;

		return (
			<div className="servers">
				<Header as="h5" inverted textAlign='center'>
					Servers
				</Header>

				<ServerList servers={servers} currentServerId={currentServerId} />

				<AddServer />
			</div>
		);
	}
}

Servers.defaultProps = {
	currentServerId: ''
};

Servers.propTypes = {
	servers: PropTypes.arrayOf(
		PropTypes.shape({
			server: PropTypes.object
		})
	).isRequired,
	fetchMemberServers: PropTypes.func.isRequired,
	currentServerId: PropTypes.string
};

function mapStateToProps(state, props) {
	// console.log(props.match.params.serverId);
	return {
		servers: state.servers,
		currentServerId: props.match.params.serverId
	};
}

export default withRouter(connect(mapStateToProps, { fetchMemberServers })(Servers));
