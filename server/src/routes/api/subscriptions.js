import express from 'express';
import Subscription from './../../controllers/subscriptionCtrl';
import authenticate from './../../middlewares/authenticate';

var router = express.Router();
// router.use(authenticate);

// GET holospace.com/api/subscriptions
// get list of subscriptions
//router.get('/subscriptions', Subscription.getAll);

// GET holospace.com/api/subscriptions/:id
// get one subscription by id
//router.get('/subscriptions/:id', Subscription.getOne);

// GET holospace.com/api/subscriptions/@me/channels (@me from req.currentUser)
// get list of channels @me is subscribed to
router.get(
	'/subscriptions/@me/channels',
	authenticate,
	Subscription.getDirectChannels
);

// GET holospace.com/api/subscriptions/:channelId/subscribers
// get list of channel subscribers
router.get(
	'/subscriptions/:channelId/subscribers',
	authenticate,
	Subscription.getChannelSubscribers
);

// POST holospace.com/api/subscriptions/:params
// create new subscription
//router.post('/subscriptions', authenticate, Subscription.create);

// PUT holospace.com/api/subscriptions/:params
// update a subscription
// router.put('/subscriptions/:id', Subscription.update);

// DELETE holospace.com/api/subscriptions/:id
// 'delete' a subscription
//router.delete('/subscriptions/:id', Subscription.delete);

module.exports = router;
