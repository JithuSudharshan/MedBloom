import express from 'express';
import passport from 'passport';
import * as oauthController from '../controller/userControllers/Oauth/OauthController.js';

const router = express.Router()

// Initiate Google OAuth
router.get('/google', oauthController.initiateGoogleOAuth)

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/login?error=auth_failed'
    }),
    oauthController.handleOAuthCallback
);

// Check if user is authenticated
router.get('/login/success', oauthController.checkAuthStatus)

export default router
