import db from './../models';
import parseErrors from './../utils/parseErrors';

const membershipController = {};

membershipController.getMemberServers = (req, res) => {
	let servers = [];
	let promise = db.Membership.find({
		member_id: req.currentUser._id
	})
		.where('isDeleted')
		.equals(false)
		.populate({
			path: 'server_id',
			match: {
				isDeleted: false
			},
			populate: {
				path: 'owner_id',
				select: 'username pin -_id'
			}
		})
		.exec((err, memberships) => {
			if (err) return console.log(err);
			memberships = memberships.filter(function(membership) {
				servers.push(membership.server_id);
			});
		});
	promise
		.then(memberships => {
			return res.status(200).json({ servers });
		})
		.catch(err => {
			return res.status(400).json({
				errors: parseErrors(err.errors)
			});
		});
};

membershipController.getServerMembers = (req, res) => {
	let members = [];
	let promise = db.Membership.find({
		server_id: req.params.serverId
	})
		.where('isDeleted')
		.equals(false)
		.populate({
			path: 'member_id',
			select: 'avatar username pin email online status -_id',
			match: {
				isDeleted: false
			}
		})
		.exec((err, memberships) => {
			if (err) {
				res.send({ error: err });
				return next(err);
			}

			memberships = memberships.filter(function(membership) {
				const member = {
					pin: membership.member_id.pin,
					username: membership.member_id.username,
					email: membership.member_id.email,
					online: membership.member_id.online,
					status: membership.member_id.status,
					avatar: membership.member_id.avatar,
					joined: membership.createdAt
				};
				members.push(member);
			});
		});
	promise
		.then(() => {
			// console.log(members);
			return res.status(200).json({ members });
		})
		.catch(err => {
			return res.status(400).json({
				errors: parseErrors(err.errors)
			});
		});
};

membershipController.getOne = (req, res) => {
	db.Membership.findById(req.params.id)
		.then(membership => {
			return res.status(200).json(membership);
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};

membershipController.create = (req, res) => {
	const { member_id, server_id } = req.body.membership;

	// Validations

	const membership = new db.Membership({
		member_id,
		server_id
	});

	membership
		.save()
		.then(newMembership => {
			//...
			return res.status(200).json(newMembership);
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};

membershipController.delete = (req, res) => {
	db.Membership.findByIdAndUpdate(
		req.params.id,
		{isDeleted: true},
		{new: true}
	)
		.then(updatedMembership => {
			res.status(200).json('Membership successfully deleted.');
		})
		.catch(err => {
			res.status(500).json(err);
		});
};

export default membershipController;
