import express from 'express';
import User from './../../controllers/userCtrl';
import authenticate from './../../middlewares/authenticate';

var router = express.Router();

// GET holospace.com/api/users
// get list of users
// router.get('/users', User.getAll);

// GET holospace.com/api/users/:id
// get one user by id
// router.get('/users/:id', User.getOne);

// GET holospace.com/api/users/@me
// get current user from req header
router.get('/users/@me', authenticate, User.current); 

// POST holospace.com/api/users
// create new user (register)
router.post('/users', User.register);

// PUT holospace.com/api/users/:params
// update a user by id (id from req.currentUser)
router.put('/users/@me', authenticate, User.update);

// DELETE holospace.com/api/users/:id
// delete a user by id
// router.delete('/users/@me', User.delete);

module.exports = router;
