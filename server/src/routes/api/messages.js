import express from 'express';
import Message from './../../controllers/messageCtrl';
import authenticate from './../../middlewares/authenticate';

var router = express.Router();
// router.use(authenticate);

// GET holospace.com/api/messages
// get list of messages
// router.get('/messages', authenticate, Message.getAll);

// GET holospace.com/api/messages/:id
// get one message by id
// router.get('/messages/:id', authenticate, Message.getOne);

// GET holospace.com/api/messages/channel/:channelId
// get list of channel messages
router.get('/messages/channel/:channelId', authenticate, Message.getChannelMessages);

// POST holospace.com/api/messages/:params
// create new message
router.post('/messages', authenticate, Message.create);

// PUT holospace.com/api/messages/:params
// update a message
router.put('/messages/:id', authenticate, Message.update);

// DELETE holospace.com/api/messages/:id
// 'delete' a message
// router.delete('/messages/:id', authenticate, Message.delete);

module.exports = router;
