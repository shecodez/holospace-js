import express from 'express';

var router = express.Router();

import User from './../../controllers/userCtrl';

// GET holospace.com/api/users
// get list of users
//router.get('/users', User.getAll);

// GET holospace.com/api/users/:id
// get one user by id
//router.get('/users/:id', User.getOne);

// POST holospace.com/api/users
// create new user (register)
router.post('/users', User.register);

// PUT holospace.com/api/users/:params
// update a user by id
//router.put('/users/:id', User.update);

// DELETE holospace.com/api/users/:id
// delete a user by id
//router.delete('/users/:id', User.delete);

module.exports = router;
