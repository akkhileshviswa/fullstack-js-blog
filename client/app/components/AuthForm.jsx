"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { authValidationSchema } from "../utils/ValidationSchema"

const AuthForm = ({ type = "signin", onSubmit }) => {
    const isSignup = type === "signup";

    return (
        <Formik initialValues={{ name: "", username: "", password: "" }}
            validationSchema={authValidationSchema(isSignup)}
            onSubmit={onSubmit} >
            <Form className="flex flex-col gap-2 w-80 mx-auto">
                <h2 className="text-xl font-bold mb-4 text-center">
                    {isSignup ? "Sign Up" : "Login"}
                </h2>

                {isSignup && (
                    <div>
                        <Field name="name" placeholder="Name" className="border p-2 rounded w-full" />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                    </div>
                )}

                <div>
                    <Field name="username" type="text" placeholder="Username" className="border p-2 rounded w-full" />
                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                    <Field name="password" type="password" placeholder="Password" className="border p-2 rounded w-full" />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-3">
                    {isSignup ? "Sign Up" : "Sign In"}
                </button>
            </Form>
        </Formik>
    );
};

export default AuthForm;
