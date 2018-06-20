import db from './../models';
import parseErrors from '../utils/parseErrors';

const messageController = {};

/* messageController.getAll = (req, res) => {
	db.Message.find({})
		.where('isDeleted')
		.equals(false)
		.populate({
			path: 'author_id',
			select: 'icon username pin -_id'
		})
		.then(messages => {
			return res.status(200).json(messages);
		})
		.catch(err => {
			return res.status(500).json(err);
		});
}; */

/* messageController.getOne = (req, res) => {
	db.Message.findById(req.params.id)
		.then(message => {
			return res.status(200).json(message);
		})
		.catch(err => {
			return res.status(500).json(err);
		});
}; */

messageController.getChannelMessages = (req, res) => {
	db.Message.find({
		channel_id: req.params.channelId
	})
		.where('isDeleted')
		.equals(false)
		.populate({
			path: 'author_id',
			select: 'icon username pin -_id'
		})
		.then(messages => {
			return res.status(200).json({ messages });
		})
		.catch(err => {
			return res.status(400).json({
				errors: parseErrors(err.errors)
			});
		});
};

messageController.create = (req, res) => {
	const { body, channel_id } = req.body.message;
	const author_id = req.currentUser._id;

	// Validations

	const message = new db.Message({
		body,
		author_id,
		channel_id
	});

	message
		.save()
		.then(newMessage => {
			newMessage.populate(
				{
					path: 'author_id',
					select: 'icon username pin -_id'
				},
				(err, populatedMessage) => {
					return res.status(200).json({ message: populatedMessage });
				}
			);
		})
		.catch(err => {
			return res.status(500).json(err);
		});
};

messageController.update = (req, res) => {
	db.Message.findByIdAndUpdate(
		req.params.id,
		// Validations
    {
      $set: {
        body: req.body.message.body,
      }
    },
		{ new: true }
	)
		.then(updatedMessage => {
			updatedMessage.populate(
				{
					path: 'author_id',
					select: 'icon username pin -_id'
				},
				(err, populatedMessage) => {
					return res.status(200).json({ message: populatedMessage });
				}
			);
		})
		.catch(err => {
			res.status(500).json(err);
		});
};

/* messageController.delete = (req, res) => {
	db.Message.findByIdAndUpdate(
		req.params.id,
		{ isDeleted: true },
		{ new: true }
	)
		.then(updatedMessage => {
			res.status(200).json('Message successfully deleted.');
		})
		.catch(err => {
			res.status(500).json(err);
		});
}; */

export default messageController;
