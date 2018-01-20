import db from './../models';
import parseErrors from './../utils/parseErrors';

const serverController = {};

// create new server,
// create new membership between user and server
// create new channel (named general) belonging to server,
serverController.create = (req, res) => {
	const { name, icon } = req.body.server;
	const owner_id = req.currentUser._id;

	// Validations

	const server = new db.Server({
		name,
		icon,
		owner_id
	});

	server
		.save()
		.then(newServer => {
			const membership = new db.Membership({
				member_id: newServer.owner_id,
				server_id: newServer._id
			});
			membership.save();

			const channel = new db.Channel({
				name: 'general',
				server_id: newServer._id
			});
			channel.save().then(channel => {
				newServer.setDefaultId(channel._id);

				newServer.save().then(server => {
					return res.status(200).json({
						server: server
					});
				});
			});
		})
		.catch(err => {
			return res.status(400).json({
				errors: parseErrors(err.errors)
			});
		});
};

serverController.update = (req, res) => {
	const { name, icon } = req.body.server;
	db.Server.findByIdAndUpdate(
		req.params.id,
		// Validations
    {
      $set: {
        name: name,
        icon: icon
      }
    },
		{ new: true }
	)
		.then(updatedServer => {
			res.status(200).json({ server: updatedServer });
		})
		.catch(err => {
			res.status(500).json(err);
		});
};

/* serverController.delete = (req, res) => {
	// if req.currentUser._id === server.owner_id
	db.Server.findByIdAndUpdate(
		req.params.id,
		{
			isDeleted: true
		},
		{ new: true }
	)
		.then(deletedServer => {
			db.Channel.update(
				{ server_id: deletedServer._id },
				{
					$set: { isDeleted: true }
				},
				{ multi: true }
			)
				.then()
				.catch(err => console.error(err));

			db.Membership.update(
				{ server_id: deletedServer._id },
				{
					$set: { isDeleted: true }
				},
				{ multi: true }
			)
				.then()
				.catch(err => console.error(err));
			res.status(200).json('Server successfully deleted.');
		})
		.catch(err => {
			res.status(500).json(err);
		});
}; */

export default serverController;
