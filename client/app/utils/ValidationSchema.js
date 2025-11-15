import * as Yup from "yup";

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
