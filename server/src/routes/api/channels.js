import express from 'express';
import Channel from './../../controllers/channelCtrl';
import authenticate from './../../middlewares/authenticate';

var router = express.Router();
// router.use(authenticate);

// GET holospace.com/api/channels
// get list of channels
// router.get('/channels', Channel.getAll);

// GET holospace.com/api/channels/:id
// get one channel by id
router.get('/channels/:id', authenticate, Channel.getOne);

// GET holospace.com/api/channels/:serverId
// get list of server channels
router.get('/channels/server/:serverId', authenticate, Channel.getServerChannels);

// POST holospace.com/api/channels/:params
// create new channel
router.post('/channels', authenticate, Channel.create);

// PUT holospace.com/api/channels/:params
// update a channel
router.put('/channels/:id', authenticate, Channel.update);

// DELETE holospace.com/api/channels/:id
// 'delete' a channel
// router.delete('/channels/:id', Channel.delete);

module.exports = router;
