import express from 'express';
import URL from './../../controllers/urlCtrl';
import authenticate from './../../middlewares/authenticate';

var router = express.Router();
//router.use(authenticate);

// POST holospace.com/api/shorten
// create a shortened URL given a long URL
// router.post('/shorten', URL.shorten);

module.exports = router;
