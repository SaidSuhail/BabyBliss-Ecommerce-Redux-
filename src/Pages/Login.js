import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchWishlistData, setCart, setUserId } from "../Features/userSlice";
import { useDispatch } from "react-redux";

const initialValues = {
  UserEmail: "", // Changed to match backend DTO
  Password: "", // Changed to match backend DTO
};

const validationSchema = Yup.object({
  UserEmail: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  Password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Send login request to .NET backend
      const response = await axios.post(
        "https://localhost:7055/api/Auth/Login",
        {
          UserEmail: values.UserEmail,
          Password: values.Password,
        }
      );

      if (response.status === 200) {
        const userData = response.data;

        // Handle blocked users (if your backend returns this)
        if (userData.isBlocked) {
          setFieldError(
            "general",
            "Your account has been blocked. Please contact support."
          );
          return;
        }

        // Store authentication data separately
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", userData.Token);
        localStorage.setItem("userid", userData.Id); // ✔ correct: Id with capital I
        localStorage.setItem("username", userData.UserName);
        localStorage.setItem("email", userData.UserEmail);
        localStorage.setItem("role", userData.Role);
        localStorage.removeItem("userData");

        // Sync cart from localStorage to Redux
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        dispatch(setCart(storedCart));

        // Set user ID in Redux
        dispatch(setUserId(userData.Id)); // Use `Id` here, not `id`
        dispatch(fetchWishlistData(userData.Id));

        // Handle navigation based on role
        if (userData.Role === "Admin") {
          alert("Admin login successful!");
          navigate("/admin/dashboard");
        } else {
          alert("User login successful!");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);

      // Handle backend validation errors
      if (error.response?.status === 400) {
        const backendErrors = error.response.data.errors;
        if (backendErrors) {
          Object.keys(backendErrors).forEach((field) => {
            setFieldError(field, backendErrors[field][0]);
          });
        } else {
          setFieldError("general", "Invalid email or password");
        }
      } else {
        setFieldError("general", "Login failed. Please try again.");
      }
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
                  htmlFor="UserEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <Field
                  type="email"
                  id="UserEmail"
                  name="UserEmail"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="UserEmail"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="form-control">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password:
                </label>
                <Field
                  type="password"
                  id="Password"
                  name="Password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="Password"
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
