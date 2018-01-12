import express from 'express';

var router = express.Router();

import Auth from './../../controllers/authCtrl';

// POST holospace.com/api/auth
// login user
router.post('/auth', Auth.login);

// POST holospace.com/api/auth/confirmation
// Confirm user email
router.post('/auth/confirmation', Auth.confirm);

// POST holospace.com/api/auth/resend_confirmation
// Re-send email confirm request
router.post('/auth/resend_confirmation', Auth.resendConfirmation);

// POST holospace.com/api/auth/reset_password_request
// Request password reset
//router.post('/auth/reset_password_request', Auth.resetPasswordRequest);

// POST holospace.com/api/auth/validate_token/:validateToken
// Validate password reset validateToken
//router.post('/auth/validate_token', Auth.validateToken);

// POST holospace.com/api/auth/reset_password
// Reset user password
//router.post('/auth/reset_password', Auth.resetPassword);

module.exports = router;
