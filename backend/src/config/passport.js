import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/userModel.js";
import { ENV } from "./env.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: ENV.GOOGLE_CLIENT_ID,
            clientSecret: ENV.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/oauth/google/callback",
            passReqToCallback: true  // ✅ ADD THIS - gives access to req in callback
        },

        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;

                // ✅ Get role from request (set by initiateGoogleOAuth)
                const requestedRole = req.session?.oauth_role || req.query?.role;

                console.log('Passport Strategy - Requested Role:', requestedRole);

                // Check if user exists by googleId
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    console.log('User found by googleId:', user.email);

                    // Validate role matches for existing users
                    if (user.role && user.role !== requestedRole) {
                        console.error(`Role mismatch in strategy: user.role=${user.role}, requested=${requestedRole}`);
                        return done(null, false, {
                            message: `User registered as ${user.role}`
                        });
                    }

                    return done(null, user);
                }

                // Check if user exists by email (for linking accounts)
                user = await User.findOne({ email: email });

                if (user) {
                    console.log('User found by email, linking Google account:', user.email);

                    // Validate role matches when linking
                    if (user.role && user.role !== requestedRole) {
                        console.error(`Cannot link: user.role=${user.role}, requested=${requestedRole}`);
                        return done(null, false, {
                            message: `Account exists as ${user.role}`
                        });
                    }

                    // Link Google account
                    user.googleId = profile.id;
                    user.authMethod = user.authMethod === 'local' ? 'both' : 'google';
                    user.isVerified = true;
                    user.profilePicture = user.profilePicture || profile.photos[0]?.value;

                    // Assign role if not set
                    if (!user.role && requestedRole) {
                        user.role = requestedRole;
                    }

                    await user.save();
                    return done(null, user);
                }

                // ✅ Create new user WITH role from OAuth flow
                console.log('Creating new user with email:', email, 'role:', requestedRole);

                // Validate role before creating
                if (!requestedRole || !['patient', 'doctor'].includes(requestedRole)) {
                    console.error('Invalid or missing role:', requestedRole);
                    return done(null, false, { message: 'Invalid role' });
                }

                user = await User.create({
                    googleId: profile.id,
                    email: email,
                    name: profile.displayName,
                    profilePicture: profile.photos[0]?.value,
                    authMethod: 'google',
                    isVerified: true,
                    role: requestedRole  // ✅ SET ROLE HERE
                });

                console.log('New user created with role:', user.role);
                return done(null, user);

            } catch (error) {
                console.error('Passport OAuth error:', error);
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
