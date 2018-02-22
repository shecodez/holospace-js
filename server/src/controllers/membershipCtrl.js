import db from './../models';
import jwt from 'jsonwebtoken';
import parseErrors from './../utils/parseErrors';
import mongoose from 'mongoose';

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
		.then(() => {
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

membershipController.getMutualMembers = (req, res) => {
	let members = [];
	// const serverIds = [ '5a0f4bcb1c35354aa41d95bd','5a0f4be41c35354aa41d95c0'];
	// const objectIds = serverIds.map(function(el) { return mongoose.Types.ObjectId(el) })
	getCurrentUserServerIds(req.currentUser._id)
		.then(serverIds => {
			let promise = db.Membership.find({
				server_id: { $in: serverIds }
			})
				.where('isDeleted')
				.equals(false)
				.populate({
					path: 'member_id',
					select: 'avatar username pin -_id',
					match: {
						isDeleted: false
					}
				})
				.exec((err, memberships) => {
					if (err) return console.log(err);

					memberships.filter(function(membership) {
						const member = {
							title: `${membership.member_id.username}#${
								membership.member_id.pin
							}`,
							image: membership.member_id.avatar
						};
						if (!members.some(e => e.title === member.title))
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
		})
		.catch(err => {
			console.log(err);
		});
};

const getCurrentUserServerIds = userId => {
	// console.log('getCurrentUserServerIds' +userId);
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

/* membershipController.getOne = (req, res) => {
	db.Membership.findById(req.params.id)
		.then(membership => {
			return res.status(200).json(membership);
		})
		.catch(err => {
			return res.status(500).json(err);
		});
}; */

membershipController.create = (req, res) => {
	jwt.verify(req.body.invitation, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				errors: { global: 'The invitation is invalid or expired.' }
			});
		} else {
			const server = db.Server.findOne({ _id: decoded._id }, (err, server) => {
				if (err) {
					return res.status(404).json({
						errors: { global: 'Server does NOT exist' }
					});
				}
				// findOrCreate (the long way...)
				db.Membership.findOne({
					member_id: req.currentUser._id,
					server_id: decoded._id
				})
					.then(joined => {
						if (joined) {
							return res.status(401).json({
								errors: { global: 'User is already a member of the Server' }
							});
						} else {
							const membership = new db.Membership({
								member_id: req.currentUser._id,
								server_id: decoded._id
							});

							let populatedMembership = {};
							let promises = [];
							let promise = membership
								.save()
								.then(newMembership => {
									// populate server_id && owner_id (username pin -_id)
									promises.push(
										newMembership
											.populate({
												path: 'member_id',
												select:
													'avatar username pin email online status createdAt -_id',
												match: {
													isDeleted: false
												}
											})
											.execPopulate()
								      .then((doc) => {
												console.log('populate member_id', doc);
												populatedMembership.member_id = doc.member_id;
								      })
									);
									// populate member_id (avatar username pin email online status joined -_id)
									promises.push(
										newMembership
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
											.execPopulate()
								      .then((doc) => {
												//console.log('populate server_id', doc);
												populatedMembership.server_id = doc.server_id;
											})
									);
								})
								.catch(err => {
									console.log(err);
								});
							promise
								.then(() => {
									Promise.all(promises)
										.then(() => {
											console.log('populatedMembership', populatedMembership);
											return res
												.status(200)
												.json({ membership: populatedMembership });
										})
										.catch(() => {});
								})
								.catch(() => {});
						}
					})
					.catch(err => {
						console.log(err);
					});
			});
		}
	});
};

/* membershipController.delete = (req, res) => {
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
}; */

export default membershipController;
