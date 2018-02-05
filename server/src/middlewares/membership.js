import db from './../models';

export default (req, res, next) => {
	const serverId = req.params.serverId;

	if (req.currentUser) {
		getCurrentUserMemberships(req.currentUser._id)
			.then(serverIds => {
				if (serverIds.some(e => e === serverId)) {
					next();
				} else {
					res
						.status(401)
						.json({
							errors: { global: 'You are not a member of this server' }
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

const getCurrentUserMemberships = userId => {
	return new Promise(function(resolve, reject) {
		db.Membership.find({ member_id: userId })
			.distinct('server_id')
			.where('isDeleted')
			.equals(false)
			.exec((err, serverIds) => {
				if (err) reject(err);

				resolve(serverIds);
			});
	});
};
