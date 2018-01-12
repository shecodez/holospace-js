import db from './../models';
import jwt from 'jsonwebtoken';
import { sendConfirmationEmail } from './../mailers';

const authController = {};

authController.login = (req, res) => {
	const { email, password } = req.body.credentials;

	db.User.findOne({ email })
		.then(user => {
			if (user && user.isValidPassword(password)) {
				return res.status(200).json({
					user: user.toAuthJSON()
				});
			} else {
				return res.status(400).json({
					errors: { global: 'Invalid credentials' }
				});
			}
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};

authController.confirm = (req, res) => {
	db.User.findOneAndUpdate(
		{ confirmationToken: req.body.token },
		{ confirmationToken: '', confirmed: true },
		{ new: true }
	)
		.then(confirmedUser => {
			if (confirmedUser) {
				return res.status(200).json({
					user: confirmedUser.toAuthJSON()
				});
			} else {
				jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
					if (err) {
						return res.status(400).json({
							errors: { global: 'Invalid token' }
						});
					} else {
						const user = db.User.findOne({ email: decoded.email })
							.then(user => {
								if (user.confirmed) {
									return res.status(400).json({
										errors: { global: 'User already confirmed' }
									});
								}
							})
							.catch(err => {
								return res.status(500).json(err);
							});
					}
				});
			}
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};

authController.resendConfirmation = (req, res) => {
	db.User.findOne({ email: req.body.email })
		.then(user => {
			sendConfirmationEmail(user);
			return res.status(200).json({});
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};

authController.resetPasswordRequest = (req, res) => {
	db.User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			// user.createPasswordResetToken();
			sendResetPasswordEmail(user);
			return res.status(200).json({});
		}
	});
};

export default authController;
