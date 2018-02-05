import db from './../models';

export default (req, res, next) => {
	const channelId = req.params.channelId;

	if (req.currentUser) {
		getCurrentUserSubscriptions(req.currentUser._id)
			.then(channelIds => {
				if (channelIds.some(e => e === channelId)) {
					next();
				} else {
					res
						.status(401)
						.json({
							errors: { global: 'You are not subscribed to this channel' }
						});
				}
			})
			.catch(err => {
				res
					.status(401)
					.json({ errors: { global: 'Error, please try again later ' } });
			});
	} else {
		res.status(401).json({ errors: { global: 'Unauthorized ' } });
	}
};

const getCurrentUserSubscriptions = userId => {
	return new Promise(function(resolve, reject) {
		db.Subscription.find({ subscriber_id: userId })
			.distinct('channel_id')
			.where('isDeleted')
			.equals(false)
			.exec((err, channelIds) => {
				if (err) reject(err);

				resolve(channelIds);
			});
	});
};
