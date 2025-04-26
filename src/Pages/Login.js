import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchWishlistData, setCart, setUserId } from "../Features/userSlice";
import { useDispatch } from "react-redux";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Fetch all users from the JSON server
      const response = await axios.get("http://localhost:3001/users");

      // Find a user with the same email and password
      const existingUser = response.data.find(
        (user) =>
          user.email === values.email && user.password === values.password
      );

      if (existingUser) {
        if (existingUser.blocked) {
          setFieldError(
            "general",
            "Your account has been blocked. Please contact support."
          );
        } else {
          // Store user data in localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", existingUser.name);
          localStorage.setItem("userid", existingUser.id);
          localStorage.setItem("role", existingUser.role);

          // Retrieve and dispatch cart data
          const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
          dispatch(setCart(storedCart)); // Ensure cart data is synced to Redux
          // Dispatch Redux action to set userId
          dispatch(setUserId(existingUser.id));
          dispatch(fetchWishlistData(existingUser.id));
          // fetchWishlistData(existingUser.id);  // call after setting userId

          if (existingUser.role === "admin") {
            alert("Admin login successful!");
            navigate("/admin/dashboard");
          } else {
            alert("User login successful!");
            navigate("/");
          }
        }
      } else {
        setFieldError(
          "general",
          "Invalid email or password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl">
        <h1 className="text-3xl font-extrabold text-center ">Welcome Back</h1>
        <p className="text-sm text-center text-gray-600">Login to continue</p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-4">
              {errors.general && (
                <div className="text-red-500 text-sm">{errors.general}</div>
              )}
              <div className="form-control">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="form-control">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password:
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg shadow-md font-medium transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
