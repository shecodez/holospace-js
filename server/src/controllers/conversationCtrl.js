import db from './../models';

const conversationController = {};

conversationController.create = (req, res, next) => {
	const { recipients, body, whisper } = req.body.message;

	// Validations
	if (!recipients) {
		res.status(422).send({ error: 'Invalid recipient' });
		return next(err);
	}

	if (!body) {
		res.status(422).send({ error: 'Message connot be blank' });
		return next(err);
	}

	const conversation = new db.Conversation({
		participants: [req.currentUser._id, recipients],
		whisper
	});

	conversation
		.save()
		.then(newConversation => {
			const message = new db.Message({
				conversation_id: newConversation._id,
				body: req.body.message,
				author_id: req.currentUser._id
			});
			message.save();
			return res.status(200).json({ conversation: newConversation });
		})
		.catch(err => {
			res.status(500).json(err);
		});
};
