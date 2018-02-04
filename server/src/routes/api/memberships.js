import express from 'express';
import Membership from './../../controllers/membershipCtrl';
import authenticate from './../../middlewares/authenticate';

var router = express.Router();
//router.use(authenticate); // doesnt just apply to this route for some reason...

// GET holospace.com/api/memberships
// get list of memberships
// router.get('/memberships', Membership.getAll);

// GET holospace.com/api/memberships/:serverId/members
// get list of server members
router.get(
	'/memberships/:serverId/members',
	authenticate,
	Membership.getServerMembers
);

// GET holospace.com/api/memberships/@me/mutual/members
// get list of mutual members from currentUser' servers
router.get(
	'/memberships/@me/mutual/members',
	authenticate,
	Membership.getMutualMembers
);

// GET holospace.com/api/memberships/@me/servers (@me from req.currentUser)
// get list of currentUser servers
router.get(
	'/memberships/@me/servers',
	authenticate,
	Membership.getMemberServers
);

// GET holospace.com/api/memberships/:id
// get one membership by id
// router.get('/memberships/:id', Membership.getOne);

// POST holospace.com/api/memberships/:params
// create new membership
//router.post('/memberships', authenticate, Membership.create);

// PUT holospace.com/api/memberships/:params
// update a membership
// router.put('/memberships/:id', Membership.update);

// DELETE holospace.com/api/memberships/:id
// 'delete' a membership
// router.delete('/memberships/:id', Membership.delete);

module.exports = router;
