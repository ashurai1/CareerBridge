import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const handleSocialLogin = async (provider, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ [`${provider}Id`]: profile.id });

        if (user) {
            return done(null, user);
        }

        // Check if user exists with the same email
        const email = profile.emails ? profile.emails[0].value : null;
        if (email) {
            user = await User.findOne({ email });
            if (user) {
                // Link the social account to the existing user
                user[`${provider}Id`] = profile.id;
                await user.save();
                return done(null, user);
            }
        }

        // Create new user
        const newUser = new User({
            name: profile.displayName || profile.username,
            email: email, // Email might be null for Twitter if not privileged
            [`${provider}Id`]: profile.id,
            profilePicture: profile.photos ? profile.photos[0].value : '',
            role: 'candidate', // Default role
            isVerified: true, // Social logins are verified by default
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
};

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${baseUrl}/api/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                await handleSocialLogin('google', profile, done);
            }
        )
    );
}



// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: `${baseUrl}/api/auth/github/callback`,
                scope: ['user:email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                await handleSocialLogin('github', profile, done);
            }
        )
    );
}

// LinkedIn Strategy (OpenID Connect)
if (process.env.LINKEDIN_KEY && process.env.LINKEDIN_SECRET) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    passport.use(
        'linkedin',
        new OAuth2Strategy(
            {
                authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
                tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
                clientID: process.env.LINKEDIN_KEY,
                clientSecret: process.env.LINKEDIN_SECRET,
                callbackURL: `${baseUrl}/api/auth/linkedin/callback`,
                scope: ['openid', 'profile', 'email'],
                state: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                // The generic OAuth2 strategy gives us the raw profile if we fetch it manually, 
                // but here we will rely on the verify callback after loading user profile.
                // However, passport-oauth2 doesn't auto-fetch profile by default unless we override userProfile.
                // So we will do it in the verify callback or override userProfile.
                // Let's manually fetch user info here for simplicity.

                try {
                    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user profile from LinkedIn');
                    }

                    const json = await response.json();

                    // Normalize to Passport profile structure expected by handleSocialLogin
                    const normalizedProfile = {
                        id: json.sub,
                        displayName: json.name,
                        username: json.given_name,
                        emails: [{ value: json.email }],
                        photos: [{ value: json.picture }],
                        provider: 'linkedin',
                    };

                    await handleSocialLogin('linkedin', normalizedProfile, done);
                } catch (error) {
                    done(error);
                }
            }
        )
    );
}

export default passport;
