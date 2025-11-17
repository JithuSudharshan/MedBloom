import crypto from 'crypto';
import passport from 'passport';
import { ENV } from '../../../config/env.js';
import { generateAccessToken, generateRefreshToken } from '../../../utils/tokenService.js';

// Secret key for signing state (add to your .env file)
const STATE_SECRET = ENV.STATE_SECRET || ENV.SESSION_SECRET

// Helper: Create signed state token
function createSignedState(data) {
    const payload = Buffer.from(JSON.stringify(data)).toString('base64')
    const signature = crypto
        .createHmac('sha256', STATE_SECRET)
        .update(payload)
        .digest('hex')

    return `${payload}.${signature}`
}


// Initiate Google OAuth
export const initiateGoogleOAuth = (req, res, next) => {
    const { state } = req.query;

    if (!state) {
        return res.status(400).json({ message: "Missing state parameter" })
    }

    let parsedState;
    try {
        parsedState = JSON.parse(decodeURIComponent(state));
    } catch (err) {
        console.error('State parse error:', err);
        return res.status(400).json({ message: "Invalid state format" })
    }

    const { role, timestamp } = parsedState;

    if (!role || !timestamp) {
        console.error('Missing role or timestamp');
        return res.status(400).json({ message: "Invalid state data" })
    }

    if (!['patient', 'doctor'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" })
    }

    if (Date.now() - timestamp > 5 * 60 * 1000) {
        return res.status(400).json({ message: "State expired" })
    }

    const nonce = crypto.randomBytes(16).toString('hex');

    const stateData = {
        role,
        nonce,
        timestamp: Date.now(),
        originalTimestamp: timestamp
    }

    const signedState = createSignedState(stateData)

    // Store role in session BEFORE calling passport
    req.session.oauth_role = role
    req.session.oauth_nonce = nonce

    console.log('=== INITIATING OAUTH ===')
    console.log('Role:', role);
    console.log('Storing role in session for Passport strategy')

    // Save session before passport redirect
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: "Session error" })
        }

        passport.authenticate('google', {
            scope: ['profile', 'email'],
            state: signedState,
            session: true
        })(req, res, next)
    })
}


// Handle OAuth Callback
export const handleOAuthCallback = async (req, res) => {
    try {
        console.log('=== OAUTH CALLBACK ===')

        const user = req.user

        if (!user) {
            console.error('No user from passport')
            return res.redirect('http://localhost:5173/login?error=auth_failed')
        }

        console.log('User authenticated:', user.email, 'Role:', user.role)

        // User already has correct role from Passport strategy
        if (!user.role) {
            console.error('User has no role assigned');
            return res.redirect('http://localhost:5173/login?error=no_role')
        }

        // Generate tokens
        const accessToken = await generateAccessToken(user._id, user.email, user.role)
        const refreshToken = await generateRefreshToken(user._id)

        // Set cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        console.log('Tokens generated and cookies set')

        // Establish Passport session
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return res.redirect('http://localhost:5173/login?error=login_failed')
            }

            // Clean up session OAuth data
            delete req.session.oauth_role;
            delete req.session.oauth_nonce;

            console.log(`SUCCESS: Redirecting to /${user.role}/dashboard`)
            res.redirect(`http://localhost:5173/${user.role}/dashboard`)
        })

    } catch (error) {
        console.error('OAuth callback error:', error);
        res.redirect('http://localhost:5173/login?error=server_error')
    }
}


// Check Authentication Status
export const checkAuthStatus = (req, res) => {
    console.log('=== AUTH STATUS CHECK ===');
    console.log('Authenticated:', req.isAuthenticated())
    console.log('User:', req.user?.email);

    if (req.isAuthenticated() && req.user) {
        return res.json({
            success: true,
            message: "User authenticated",
            user: {
                id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role,
                profilePicture: req.user.profilePicture
            }
        })
    }

    return res.status(401).json({
        success: false,
        message: "User not authenticated"
    })
}
