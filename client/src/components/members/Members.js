import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchServerMembers } from './../../actions/memberships';

import MemberList from './MemberList';

class Members extends React.Component {
	state = {
		serverId: this.props.match.params.serverId
	};

	componentDidMount() {
		this.props.fetchServerMembers(this.state.serverId);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.serverId !== this.state.serverId)
			this.props.fetchServerMembers(nextProps.match.params.serverId);

		this.setState({ serverId: nextProps.match.params.serverId });
	}

	render() {
		const { members, server } = this.props;

		const online = [];
		const offline = [];

		if (members && server) {
			members.forEach(member => {
				switch (member.online) {
					case true:
						if (member.status === 'Hide') offline.push(member);
						else online.push(member);
						break;

					default:
						offline.push(member);
				}
			});
		}

		return (
			<div className="members">
				<Header as="h3" inverted className="main-header">
          {`Members (${members.length})`}
        </Header>

				{server && (
					<div className="members-list">
						<Header as="h4" inverted>{`Online (${online.length})`}</Header>
						<MemberList server={server} online={'online'} members={online} />

						<Header as="h4" inverted>{`Offline (${offline.length})`}</Header>
						<MemberList server={server} online={'offline'} members={offline} />
					</div>
				)}
			</div>
		);
	}
}

Members.defaultProps = {
	server: null
};

Members.propTypes = {
	members: PropTypes.arrayOf(
		PropTypes.shape({
			member: PropTypes.object
		})
	).isRequired,
	fetchServerMembers: PropTypes.func.isRequired,
	match: PropTypes.shape({
    params: PropTypes.shape({
      serverId: PropTypes.string.isRequired
    })
  }).isRequired,
	server: PropTypes.shape({
    owner_id: PropTypes.shape({
      username: PropTypes.string,
      pin: PropTypes.number
    })
  })
};

function mapStateToProps(state, props) {
	// console.log(props);
	return {
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		),
		members: state.memberships
	};
}

// export default connect(mapStateToProps, { fetchServerMembers })(withRouter(Members));
export default withRouter(
	connect(mapStateToProps, { fetchServerMembers })(Members)
);
