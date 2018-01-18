import db from './../models';
import jwt from 'jsonwebtoken';
import parseErrors from './../utils/parseErrors';
import { sendConfirmationEmail, sendResetPasswordEmail } from './../mailers';

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

// TODO: add reset-timer so users cant spam reset request
authController.resetPasswordRequest = (req, res) => {
	db.User.findOne({ email: req.body.email })
		.then(user => {
			user.createPasswordResetToken();
			user.save().then(user => {
				sendResetPasswordEmail(user);
				return res.status(200).json({});
			});

		})
		.catch(err => {
			// dont alert email is not valid
			return res.status(200).json({});
		});
};

authController.validateToken = (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, err => {
    if (err) {
      return res.status(401).json({
        errors: { global: "Invalid token" }
      });
    } else {
      return res.status(200).json({});
    }
  });
};

authController.resetPassword = (req, res) => {
	const { password, token } = req.body.data;

  db.User.findOneAndUpdate(
    { passwordResetToken: token },
    { passwordResetToken: '' },
    { new: true }
  ).then(resetRequester => {
      if (resetRequester) {
        jwt.verify(req.body.data.token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).json({
              errors: { global: 'Invalid token' }
            });
          } else {
            const user = db.User.findOne({ _id: decoded._id })
              .then(user => {
                if (user && user.email === resetRequester.email) {
									user.hashPassword(password);
          				user.save().then(() => res.json({}));
									// sendPasswordUpdatedEmail(user);
								}
                else {
                  return res.status(404).json({
                    errors: { global: 'Invalid token' }
                  });
                }
              })
              .catch(err => {
                return res.status(500).json(err);
              });
          }
        });
      } else {
				return res.status(404).json({
					errors: { global: 'Invalid token' }
				});
			}
    })
		.catch(err => {
			return res.status(500).json(err);
		});
};



export default authController;
