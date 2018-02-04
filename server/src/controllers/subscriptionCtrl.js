import db from './../models';
// import Promise from 'bluebird';
import parseErrors from './../utils/parseErrors';

const subscriptionController = {};

subscriptionController.create = (req, res) => {
	const { subscriber_id, channel_id } = req.body.subscription;

	// Validations

	const subscription = new db.Subscription({
		subscriber_id,
		channel_id
	});

	subscription
		.save()
		.then(newSubscription => {
			//...
			return res.status(200).json(newSubscription);
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};

subscriptionController.getDirectChannels = (req, res) => {
	let channels = [];
	let promises = [];
	let _promise = db.Subscription.find({
		subscriber_id: req.currentUser._id
	})
		.where('isDeleted')
		.equals(false)
		.populate({
			path: 'channel_id',
			match: {
				isDeleted: false
			}
		})
		.exec((err, subscriptions) => {
			if (err) return console.log(err);
			subscriptions.filter(function(subscription) {
				promises.push(
					getChannelSubscribers(subscription.channel_id._id)
						.then(subscribers => {
							const channel = {
								_id: subscription.channel_id._id,
								name: subscription.channel_id.name,
								topic: subscription.channel_id.topic,
								type: subscription.channel_id.type,
								direct: subscription.channel_id.direct,
								subscribers: subscribers
							};
							channels.push(channel);
						})
						.catch(() => {})
				);
			});
		});
	_promise
		.then(() => {
			Promise.all(promises)
				.then(() => {
					// console.log(channels);
					return res.status(200).json({ channels });
				})
				.catch(err => {
					return res.status(400).json({
						errors: parseErrors(err.errors)
					});
				});
		})
		.catch(() => {});
};

const getChannelSubscribers = channelId => {
	let subscribers = [];
	return new Promise((resolve, reject) => {
		let promise = db.Subscription.find({
			channel_id: channelId
		})
			.where('isDeleted')
			.equals(false)
			.populate({
				path: 'subscriber_id',
				select: 'avatar username pin -_id',
				match: {
					isDeleted: false
				}
			})
			.exec((err, subscriptions) => {
				if (err) reject(err);
				subscriptions.filter(function(subscription) {
					subscribers.push(subscription.subscriber_id);
				});
			});
		promise.then(() => {
			resolve(subscribers);
		});
	});
};

subscriptionController.getChannelSubscribers = (req, res) => {
	let subscribers = [];
	let promise = db.Subscription.find({
		channel_id: req.params.channelId
	})
		.where('isDeleted')
		.equals(false)
		.populate({
			path: 'subscriber_id',
			select: 'avatar username pin -_id',
			match: {
				isDeleted: false
			}
		})
		.exec((err, subscriptions) => {
			if (err) return console.log(err);
			subscriptions = subscriptions.filter(function(subscription) {
				subscribers.push(subscription.subscriber_id);
			});
		});
	promise
		.then(subscriptions => {
			return res.status(200).json({ subscribers });
		})
		.catch(err => {
			return res.status(400).json({
				errors: parseErrors(err.errors)
			});
		});
};

export default subscriptionController;
