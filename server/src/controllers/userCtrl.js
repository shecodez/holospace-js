import db from './../models';
import parseErrors from './../utils/parseErrors';
import { sendConfirmationEmail } from './../mailers';

const userController = {};

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

// TODO: handle change password and
// only allow username to change once
userController.update = (req, res) => {
	const { avatar, email, status } = req.body.user;
	db.Server.findByIdAndUpdate(
		req.currentUser._id,
		// Validations
    {
      $set: {
        avatar: avatar,
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
