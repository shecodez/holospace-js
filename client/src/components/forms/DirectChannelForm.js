import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import _ from "lodash";
import {
	Form,
	Button,
	Message,
	Icon,
	Label,
	Segment,
	Header,
	Search
} from "semantic-ui-react";
import { FormattedMessage } from "react-intl";

// import placeholder from './../../assets/images/favicon-32x32.png';

// components
import InlineError from "./../alerts/InlineError";

class DirectChannelForm extends React.Component {
	state = {
		data: {
			_id: this.props.channel ? this.props.channel._id : null,
			name: this.props.channel ? this.props.channel.name : "direct",
			topic: this.props.channel ? this.props.channel.topic : "",
			type: this.props.channel
				? this.props.channel.type
				: this.props.type,
			direct: this.props.channel ? this.props.channel.direct : true,
			selectedUsers: [
				{
					title: `${this.props.user.username}#${this.props.user.pin}`,
					image: this.props.user.icon
				}
			]
		},
		query: "",
		searchOptions: {},
		results: [],
		serverMembers: [],
		loading: false,
		errors: {},
		searchLoading: false
	};

	componentWillMount() {
		this.resetComponent();
	}

	componentDidMount() {
		this.fetchMutualMembers();
		this.fetchSearchOptions();
		if (this.state.data._id) this.setSelectedUsers();
	}

	setSelectedUsers = () => {
		const { subscribers } = this.props.channel;
		const selectedUsers = [];
		if (subscribers) {
			subscribers.filter(subscriber =>
				selectedUsers.push({
					title: `${subscriber.username}#${subscriber.pin}`,
					image: subscriber.icon
				})
			);
			this.setState({ data: { ...this.state.data, selectedUsers } });
		}
	};

	fetchMutualMembers = () => {
		this.setState({ loading: true });
		axios
			.get(`/api/memberships/@me/mutual/members`)
			.then(res => res.data.members)
			.then(members => {
				this.setState({ serverMembers: members, loading: false });
			});
	};

	// pull all users from db so user can choose anyone who's tag they know
	fetchSearchOptions = () => {
		this.setState({ loading: true });
		axios
			.get(`/api/users/search?q=${this.state.query}`)
			.then(res => res.data.users)
			.then(users => {
				this.setState({
					searchOptions: users,
					loading: false
				});
			});
	};

	resetComponent = () =>
		this.setState({ searchLoading: false, results: [], query: "" });

	handleResultSelect = (e, { result }) => {
		this.setState({ query: result.title });
		const user = { title: result.title, image: result.image };
		this.selectUser(user);
	};

	handleSearchChange = (e, { value }) => {
		this.setState({ searchLoading: true, query: value });

		setTimeout(() => {
			if (this.state.query.length < 1) return this.resetComponent();

			const re = new RegExp(_.escapeRegExp(this.state.query), "i");
			const isMatch = result => re.test(result.title);

			this.setState({
				searchLoading: false,
				results: _.filter(this.state.searchOptions, isMatch)
			});
			/* this.setState({
        serverMembers: _.filter(this.state.serverMembers, isMatch)
      }); */
		}, 500);
	};

	onChange = e => {
		if (this.state.errors[e.target.name]) {
			const errors = Object.assign({}, this.state.errors);
			delete errors[e.target.name];
			this.setState({
				data: { ...this.state.data, [e.target.name]: e.target.value },
				errors
			});
		} else {
			this.setState({
				data: { ...this.state.data, [e.target.name]: e.target.value }
			});
		}
	};

	onSubmit = e => {
		e.preventDefault();
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			this.props.submit(this.state.data);
		}
	};

	validate = data => {
		const errors = {};
		if (!data.name) errors.name = "Cannot be blank";
		if (data.name.length > 50) errors.name = "Channel name too long";
		if (data.selectedUsers.length <= 1)
			errors.selectedUsers = "Add more peeps to your group";
		return errors;
	};

	selectUser = user => {
		const selected = this.state.data.selectedUsers;

		if (!selected.some(e => e.title === user.title)) {
			this.setState({
				data: { ...this.state.data, selectedUsers: [...selected, user] }
			});
		}
		const errors = Object.assign({}, this.state.errors);
		delete errors.selectedUsers;
		this.setState({
			errors
		});
	};

	removeUser = user => {
		const selected = this.state.data.selectedUsers;

		const i = selected.indexOf(user);
		if (i >= 0) {
			selected.splice(i, 1);
			this.setState({
				data: { ...this.state.data, selectedUsers: selected }
			});
		}
	};

	render() {
		const { user } = this.props;
		const {
			data,
			errors,
			loading,
			query,
			results,
			serverMembers
		} = this.state;
		const buttonText = data._id ? "Update" : "Create";

		return (
			<Form
				className="direct-channel-form"
				onSubmit={this.onSubmit}
				loading={loading}
			>
				{errors.global && (
					<Message negative>
						<Message.Header>
							Oops, something went wrong!
						</Message.Header>
						<p>{errors.global}</p>
					</Message>
				)}

				<Form.Field>
					<Search
						loading={this.state.searchLoading}
						onResultSelect={this.handleResultSelect}
						onSearchChange={this.handleSearchChange}
						results={results}
						value={query}
						placeholder="Search via HoloTag#1234..."
					/>
				</Form.Field>

				{data._id && (
					<Form.Field error={!!errors.name}>
						<label htmlFor="name">
							<FormattedMessage
								id="forms.name"
								defaultMessage="Name"
							/>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							placeholder=" "
							value={data.name}
							onChange={this.onChange}
						/>
						{errors.name && <InlineError text={errors.name} />}
					</Form.Field>
				)}

				{data._id && (
					<Form.Field error={!!errors.topic}>
						<label htmlFor="topic">
							<FormattedMessage
								id="forms.topic"
								defaultMessage="Topic"
							/>
						</label>
						<input
							type="text"
							id="topic"
							name="topic"
							placeholder=" "
							value={data.topic}
							onChange={this.onChange}
						/>
						{errors.topic && <InlineError text={errors.topic} />}
					</Form.Field>
				)}

				<Header as="h5">
					<FormattedMessage
						id="forms.selectUsersHeader"
						defaultMessage="Select users to create your channel"
					/>
				</Header>
				<Segment className="server-members">
					{serverMembers &&
						serverMembers.map(member => (
							<Label
								as="a"
								image
								key={member.title}
								onClick={() => this.selectUser(member)}
							>
								<img src={member.image} alt="userIcon" />
								{member.title}
								<Icon
									name="delete"
									onClick={() => this.selectUser(member)}
								/>
							</Label>
						))}
				</Segment>

				<Header as="h5">
					<FormattedMessage
						id="forms.selectedUsers"
						defaultMessage="Selected users"
					/>
					{`: (${data.selectedUsers.length})`}
				</Header>
				<Form.Field error={!!errors.selectedUsers}>
					<Segment>
						{data.selectedUsers &&
							data.selectedUsers.map(member => (
								<Label image key={member.title}>
									<img src={member.image} alt="userIcon" />
									{member.title}
									{`${user.username}#${user.pin}` !==
										member.title && (
										<Icon
											name="delete"
											onClick={() =>
												this.removeUser(member)
											}
										/>
									)}
								</Label>
							))}
					</Segment>
					{errors.selectedUsers && (
						<InlineError text={errors.selectedUsers} />
					)}
				</Form.Field>

				<Button color="violet">{`${buttonText} Direct Channel`}</Button>
			</Form>
		);
	}
}

DirectChannelForm.defaultProps = {
	channel: null,
	user: {}
};

DirectChannelForm.propTypes = {
	submit: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	channel: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		topic: PropTypes.string,
		type: PropTypes.string,
		direct: PropTypes.bool,
		subscribers: PropTypes.arrayOf(PropTypes.shape({}))
	}),
	user: PropTypes.shape({
		icon: PropTypes.string,
		username: PropTypes.string,
		pin: PropTypes.number
	})
};

export default DirectChannelForm;
