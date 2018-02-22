import express from 'express';
import Server from './../../controllers/serverCtrl';
import authenticate from './../../middlewares/authenticate';

var router = express.Router();
//router.use(authenticate);

// GET holospace.com/api/servers
// get list of servers
// router.get('/servers', Server.getAll);

// GET holospace.com/api/servers/:id
// get one server by id
router.get('/servers/:id', Server.getOne);

// GET holospace.com/api/servers/invite
// Request server invitation
router.get('/servers/:id/invite', authenticate, Server.invite);

// POST holospace.com/api/servers/:params
// create new server
router.post('/servers', authenticate, Server.create);

// POST holospace.com/api/servers/join/:invitation
// Validate server invitation same as create membership
// router.post('/servers/join', authenticate, Server.join);

// PUT holospace.com/api/servers/:params
// update a server
router.put('/servers/:id', authenticate, Server.update);

// DELETE holospace.com/api/servers/:id
// 'delete' a server
// router.delete('/servers/:id', Server.delete);

module.exports = router;
