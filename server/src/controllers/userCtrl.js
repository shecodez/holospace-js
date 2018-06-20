import db from './../models';
import parseErrors from './../utils/parseErrors';
import { sendConfirmationEmail } from './../mailers';

const userController = {};

userController.getAll = (req, res) => {
	let users = [];
	let promise = db.User.find({})
		.where('isDeleted')
		.equals(false)
		.exec((err, foundUsers) => {
			if (err) console.log(err);
			foundUsers.filter(function(user) {
				users.push({
					title: `${user.username}#${user.pin}`,
					image: user.icon
				});
			});
		});
	promise
		.then(() => {
			return res.status(200).json({ users });
		})
		.catch(err => {
			return res.status(400).json(err);
		});
};

userController.register = (req, res) => {
	const { username, email, password } = req.body.user;

	// validations

	const user = new db.User({
		username,
		email
	});
	user.generatePin();
	// TODO: username + pin should be unique
	// else generatePin() until it is...
	user.hashPassword(password);
	user.setConfirmationToken();

	user
		.save()
		.then(newUser => {
			sendConfirmationEmail(newUser);

			return res.status(200).json({
				user: newUser.toAuthJSON()
			});
		})
		.catch(err => {
			return res.status(400).json({
				errors: parseErrors(err.errors)
			});
		});
};

userController.current = (req, res) => {
	return res.status(200).json({
		user: {
			icon: req.currentUser.icon,
			email: req.currentUser.email,
			username: req.currentUser.username,
			pin: req.currentUser.pin,
			online: req.currentUser.online,
			status: req.currentUser.status,
			confirmed: req.currentUser.confirmed
		}
	});
};

// TODO: handle change password and
// only allow username to change once
userController.update = (req, res) => {
	const { icon, email, status } = req.body.user;
	db.User.findByIdAndUpdate(
		req.currentUser._id,
		// Validations
		{
			$set: {
				icon: icon,
				email: email,
				status: status
			}
		},
		{ new: true }
	)
		.then(updatedUser => {
			res.status(200).json({ user: updatedUser });
		})
		.catch(err => {
			res.status(500).json(err);
		});
};

export default userController;
