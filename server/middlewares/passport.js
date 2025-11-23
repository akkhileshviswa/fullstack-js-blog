import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { supabase } from "../config/supabaseClient.js";
import { generateToken } from "../utils/jwt.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
        },
        /**
         * Google OAuth strategy callback function.
         * Handles user authentication/registration via Google OAuth.
         * Checks if user exists, creates new user if needed, and generates JWT token.
         * 
         * @async
         * @function googleStrategyCallback
         * @param {string} accessToken - Google OAuth access token
         * @param {string} refreshToken - Google OAuth refresh token
         * @param {Object} profile - Google user profile object
         * @param {string} profile.id - Google user ID
         * @param {string} profile.displayName - Google user display name
         * @param {Function} done - Passport callback function
         * @returns {Promise<void>} Calls done callback with user data or error
         * 
         * @throws {Error} If database query fails - passed to done callback
         * @throws {Error} If user creation fails - passed to done callback
         * @throws {Error} If token generation fails - passed to done callback
         */
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { data: user, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("google_id", profile.id)
                    .maybeSingle();

                if (userError) {
                    console.error("Supabase fetching error:", userError);
                    throw new Error("Database error while fetching user.");
                }

                let finalUser = user;

                if (!user) {
                    const { data: newUser, error: newUserError } = await supabase
                        .from("users")
                        .insert([{ name: profile.displayName, google_id: profile.id }])
                        .select()
                        .single();

                    if (newUserError) {
                        console.error("Supabase insert error:", newUserError);
                        throw new Error("Could not create new user credentials.");
                    }

                    const { data: user, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("google_id", profile.id)
                    .maybeSingle();

                    finalUser = user;
                }
                const token = generateToken(finalUser.id);

                done(null, {user:finalUser, token});
            } catch (err) {
                done(err, null);
            }
        }
    )
);

export default passport;
