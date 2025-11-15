import bcrypt from "bcrypt";
import { signupSchema, signinSchema } from "../utils/validationSchemas.js";
import { generateToken } from "../utils/jwt.js";
import { supabase } from "../config/supabaseClient.js";

export const signup = async (req, res) => {
    try {
        const validation_result = signupSchema.safeParse(req.body);

        if (!validation_result.success) {
            return res.status(400).json({ message: validation_result.error.issues[0].message });
        }

        const { name, username, password } = validation_result.data;

        const { data: existingUser, message: userCheckError } = await supabase
            .from("users")
            .select("id")
            .eq("username", username)
            .maybeSingle();

        if (userCheckError) {
            console.error("Error while checking user existance: ", userCheckError)
            return res.status(500).json({ message: "Internal Error Occured. Contact Support!" });
        }

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: credData, error: createError } = await supabase
            .from("users")
            .insert([{ name, username, encryted_password: hashedPassword }])
            .select("id")
            .single();

        if (createError) {
            console.error("Error while creating user: ", createError);
            return res.status(500).json({ error: "Cannot create Account. Contact Support!" });
        }

        const token = generateToken(credData.id);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: { id: credData.id, name: credData.name },
        });
    } catch (err) {
        console.error(err);
        if (err.errors) return res.status(400).json({ errors: err.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signin = async (req, res) => {
    try {
        const validation_result = signinSchema.safeParse(req.body);

        if (!validation_result.success) {
            return res.status(400).json({ error: validation_result.error.issues[0].message });
        }

        const { username, password } = validation_result.data;

        if (!username || !password) {
            return res.status(401).json({ message: "All fields are required!" });
        }

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .single();

        if (error) {
            console.error(error);
            return res.status(404).json({ message: "Contact Support!" });
        }

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const match = await bcrypt.compare(password, user.encryted_password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token = generateToken(user.id);
        res.status(200).json({
            message: "Sign In successful",
            token,
            user: { id: user.id, name: user.name },
        });

    } catch (err) {
        if (err.errors) return res.status(400).json({ errors: err.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProfile = async (req, res) => {

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.user.id)
        .single();

    if (error) {
        console.error(error);
        return res.status(404).json({ message: "Contact Support!" });
    }

    if (!data) {
        return res.status(401).json({ message: "Invalid credentials!" });
    }

    res.status(200).json({ id: data.id, name: data.name });
};

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "prod",
        sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
};
