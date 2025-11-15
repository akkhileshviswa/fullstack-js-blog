import { z } from "zod";

const nameSchema = z.string()
                    .min(5, "Name must be at least 5 characters")
                    .max(30, "Name must not exceed 30 characters");

const usernameSchema = z.string()
                        .min(5, "Name must be at least 5 characters")
                        .max(30, "Name must not exceed 30 characters");

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export const signupSchema = z.object({
    name: nameSchema,
    username: usernameSchema,
    password: passwordSchema
});

export const signinSchema = z.object({
    username: usernameSchema,
    password: passwordSchema
});

export const postSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(5, "Content must be at least 5 characters")
});
