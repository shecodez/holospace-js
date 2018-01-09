import db from './../models';

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

export default authController;
