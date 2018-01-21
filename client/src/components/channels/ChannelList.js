import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List, Button, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { updateChannel } from './../../actions/channels';

// components
import ChannelForm from './../forms/ChannelForm';

class ChannelList extends React.Component {
	state = {
		isOpen: false
	};

	submit = data => {
		this.props.updateChannel(data).then(() => this.toggleModal());
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};
	render() {
		const { isOpen } = this.state;
		const { channels } = this.props;

		return (
			<List className="channel-list">
				{channels.map(channel => (
					<List.Item className={`channel`} key={channel._id}>
						<Link
							to={`/channels/serverId/${channel._id}`}
							className="channel-link"
						>
							<span className="prepend">
								{channel.type === 'Text' ? '# ' : ''}
							</span>{' '}
							{channel.name}
						</Link>

						<Button icon="setting" onClick={this.toggleModal} />

						<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
							<Modal.Header>Update Channel</Modal.Header>
							<Modal.Content>
								<ChannelForm
									channel={channel}
									submit={this.submit}
									type={channel.type}
								/>
							</Modal.Content>
						</Modal>
					</List.Item>
				))}
			</List>
		);
	}
}

ChannelList.defaultProps = {
	// currentChannelId: ''
};

ChannelList.propTypes = {
	channels: PropTypes.arrayOf(PropTypes.object).isRequired,
	// currentChannelId: PropTypes.string,
	updateChannel: PropTypes.func.isRequired
};

export default connect(null, { updateChannel })(ChannelList);
