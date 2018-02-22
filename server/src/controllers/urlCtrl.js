import db from './../models';
import base58 from './../utils/base58';

const urlController = {};

urlController.shorten = (req, res) => {
	const longURL = req.body.url;
	let tinyURL = '';

	db.URL.findOne({ longURL })
		.then(doc => {
			if (doc) {
				tinyURL = config.webhost + base58.encode(doc._id);
				return res.status(200).json({
					tinyURL
				});
			} else {
				const newURL = db.URL({
					longURL
				});
				newURL.save(err => {
					if (err) console.log(err);
					tinyURL = config.webhost + base58.encode(newURL._id);
					return res.status(200).json({
						tinyURL
					});
				});
			}
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};
