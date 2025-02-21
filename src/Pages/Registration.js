import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TestError from "./TestError";
import { Link } from "react-router-dom";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function Registration() {
  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Fetch existing users by email and name
      const response = await axios.get("http://localhost:3001/users");
      const existingUserEmail = response.data.find((user) => user.email === values.email);
      const existingUserName = response.data.find((user) => user.name === values.name);

      if (existingUserEmail) {
        // If email already exists, show error
        setFieldError("email", "This email is already registered.");
        return;
      }

      if (existingUserName) {
        // If username already exists, show error
        setFieldError("name", "This username is already taken.");
        return;
      }

      // Add additional fields (cart, orders, wishlist) to the user data
      const newUser = {
        ...values,
        cart: [], 
        orders: [],
        wishlist: [], 
      };

      // Register new user
      const createUserResponse = await axios.post("http://localhost:3001/users", newUser);
      const userId = createUserResponse.data.id; 
      console.log(userId)
      alert("Registration successful!");
      navigate("/login"); 
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur shadow-xl rounded-2xl">
        <h1 className="text-3xl font-extrabold text-center">Registration Page</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="form-control">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Username:
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="name" component={TestError} />
              </div>
              <div className="form-control">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="email" component={TestError} />
              </div>
              <div className="form-control">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password:
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="password" component={TestError} />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg shadow-md font-medium transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Submitting..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-4">
          <p>Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Registration;
