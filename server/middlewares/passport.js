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
