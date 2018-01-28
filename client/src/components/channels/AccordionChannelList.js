import React from 'react';
import PropTypes from 'prop-types';
import { List, Accordion, Icon, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// components
import ChannelListItem from './ChannelListItem';

class AccordionChannelList extends React.Component {
	state = {
		activeIndex: -1,
		connections: []
	};

	componentDidMount() {
		this.props.socket.on('connections:update', this.updateConnections);
	}

	handleClick = (e, titleProps) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;

		this.setState({ activeIndex: newIndex });
	};

	updateConnections = data => {
		this.setState({ connections: data });
	};

	renderUserPresence = connections => {
		if (connections) {
			return connections.map(user => (
				<List.Item key={user.userTag}>
					<Image avatar src={user.iconURL} />
					<List.Content>
						<List.Header>{user.userTag.slice(0, -5)}</List.Header>
					</List.Content>
				</List.Item>
			));
		}
		return null;
	};

	render() {
		const { activeIndex, connections } = this.state;
		const { channels, socket } = this.props;

		return (
			<List className="channel-list accordion-channel-list">
				{channels.map((channel, i) => (
					<Accordion inverted key={channel._id}>
						<Accordion.Title
							active={activeIndex === i}
							index={i}
							onClick={this.handleClick}
						>
							<Icon name="dropdown" />
							<ChannelListItem
								channel={channel}
								key={channel._id}
								socket={socket}
							/>
						</Accordion.Title>
						<Accordion.Content active={activeIndex === i}>
							{connections[channel._id] && (
								<List
									className="channel-presence"
									inverted
									size="mini"
									verticalAlign="middle"
								>
									{this.renderUserPresence(connections[channel._id])}
								</List>
							)}
						</Accordion.Content>
					</Accordion>
				))}
			</List>
		);
	}
}

AccordionChannelList.propTypes = {
	channels: PropTypes.arrayOf(PropTypes.object).isRequired,
	socket: PropTypes.shape({
		on: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(connect(null)(AccordionChannelList));
