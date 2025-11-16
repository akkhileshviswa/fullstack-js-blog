import * as Yup from "yup";

/**
 * Creates a Yup validation schema for authentication forms (signup or signin).
 * Returns different validation rules based on whether it's a signup or signin form.
 *
 * @param {boolean} isSignup - Whether the schema is for signup (true) or signin (false)
 * @returns {Yup.ObjectSchema} A Yup validation schema object with validation rules for name, username, and password
 *
 * @throws {Error} If validation fails, Yup will throw validation errors
 */
export const authValidationSchema = (isSignup) => Yup.object({
    name: isSignup
        ? Yup.string().min(5, "Name must be at least 5 characters").required("Name is required")
        : Yup.string().notRequired(),

    username: Yup.string()
        .min(5, "Username must be at least 5 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Invalid username — only letters, numbers, and underscores allowed")
        .required("Username is required"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});
