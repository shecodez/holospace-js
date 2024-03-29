import db from './../models';
import parseErrors from './../utils/parseErrors';

const channelController = {};

/* channelController.getAll = (req, res) => {
	db.Channel.find({})
		.then(channels => {
			return res.status(200).json({ channels });
		})
		.catch(err => {
			return res.status(500).json(err);
		});
}; */

channelController.getOne = (req, res) => {
	db.Channel.findById(req.params.id)
		.populate({
			path: 'server_id',
			select: 'name -_id'
		})
		.then(channel => {
			return res.status(200).json({ channel });
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};

channelController.getServerChannels = (req, res) => {
	db.Channel.find({
		server_id: req.params.serverId
	})
		.where('isDeleted')
		.equals(false)
		.then(channels => {
			return res.status(200).json({ channels });
		})
		.catch(err => {
			return res.status(400).json({
				errors: parseErrors(err.errors)
			});
		});
};

// create new channel
// if channel.direct create subscriptions
channelController.create = (req, res) => {
	const { avatar, name, topic, type, direct, server_id } = req.body.channel;

	// authentication
	// if (server_id.owner_id !== req.currentUser._id) // return Unauthorized
	// Validations

	const channel = new db.Channel({
		avatar,
		name,
		topic,
		type,
		direct,
		server_id
	});

	if (direct) channel.owner_id = req.currentUser._id;

	channel
		.save()
		.then(newChannel => {
			if (newChannel.direct) {
				createSubscriptions(newChannel._id, req.body.channel.selectedUsers)
					.then(subscriptions => {
						const directChannel = {
							_id: newChannel._id,
							name: newChannel.name,
							topic: newChannel.topic,
							type: newChannel.type,
							direct: newChannel.direct,
							subscribers: subscriptions
						};
						return res.status(200).json({ channel: directChannel });
					})
					.catch(err => {
						console.log(err);
					});
			}
			if (!req.body.channel.direct)
				return res.status(200).json({ channel: newChannel });
		})
		.catch(err => {
			//return res.status(500).json(err);
			console.log(err);
		});
};

const createSubscriptions = (channelId, selectedUsers) => {
	let subscribers = [];
	let promises = [];
	let subPromises = [];

	return new Promise(function(resolve, reject) {
		selectedUsers.map(user => {
			promises.push(
				db.User.findOne({ username: user.slice(0, -5), pin: user.slice(-4) })
					.then(subscriber => {
						const subscription = new db.Subscription({
							subscriber_id: subscriber._id,
							channel_id: channelId
						});
						subPromises.push(
							subscription
								.save()
								.then(newSubscription => {
									subscribers.push({
										username: subscriber.username,
										pin: subscriber.pin
									});
								})
								.catch(err => {
									console.log(err);
								})
						);
					})
					.catch(err => {
						console.log(err);
					})
			);
		});
		Promise.all(promises)
			.then(() => {
				Promise.all(subPromises)
					.then(() => {
						resolve(subscribers);
						// console.log(subscribers);
					})
					.catch(err => {
						reject(err);
						// console.log(err);
					});
			})
			.catch(err => {
				console.log(err);
			});
	});
};

channelController.update = (req, res) => {
	const { avatar, name, topic, direct } = req.body.channel;
	db.Channel.findByIdAndUpdate(
		req.params.id,
		// Validations
		{
			$set: {
				avatar: avatar,
				name: name,
				topic: topic,
				direct: direct
			}
		},
		{ new: true }
	)
		.then(updatedChannel => {
			res.status(200).json({ channel: updatedChannel });
		})
		.catch(err => {
			res.status(500).json(err);
		});
};

/* channelController.delete = (req, res) => {
	db.Channel.findByIdAndUpdate(
		req.params.id,
		{ isDeleted: true },
		{ new: true }
	)
		.then(updatedChannel => {
			res.status(200).json('Channel successfully deleted.');
		})
		.catch(err => {
			res.status(500).json(err);
		});
}; */

export default channelController;
