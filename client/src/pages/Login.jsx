// pages/Login.jsx - Fixed Version
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/baseurl";

const Login = () => {
  // Redux & Navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  // Form States
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });

  // Error & Loading States
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    auth: "",
  });
  const [loading, setLoading] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      auth: "",
    };
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailId) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.emailId)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Additional validation for signup
    if (isNewUser) {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = "First name is required";
        isValid = false;
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, auth: "" }));

    try {
      const result = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId: formData.emailId,
          password: formData.password,
        },
        { withCredentials: true },
      );

      const userData = result?.data?.data;
      dispatch(addUser(userData));

      // Reset form
      setFormData({ firstName: "", lastName: "", emailId: "", password: "" });

      // Navigate to home
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login Error:", error);
      setErrors((prev) => ({
        ...prev,
        auth: error?.response?.data?.msg || "Login failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle SignUp
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, auth: "" }));

    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          password: formData.password,
        },
        { withCredentials: true },
      );

      const newUserData = res?.data?.data;
      dispatch(addUser(newUserData));

      // Reset form
      setFormData({ firstName: "", lastName: "", emailId: "", password: "" });

      // Navigate to profile
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Signup Error:", error);
      setErrors((prev) => ({
        ...prev,
        auth: error?.response?.data?.err || "Signup failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Toggle between Login and Signup
  const toggleAuthMode = () => {
    setIsNewUser((prev) => !prev);
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      auth: "",
    });
    setFormData({
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
    });
  };

  // Dismiss auth error
  const dismissAuthError = () => {
    setErrors((prev) => ({ ...prev, auth: "" }));
  };

  // Show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-2">
            {isNewUser ? "Create Account" : "Dev Tinder"}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-4">
            {isNewUser
              ? "Sign up to get started"
              : "Login to continue your journey"}
          </p>

          <form onSubmit={isNewUser ? handleSignUp : handleLogin}>
            {/* First Name & Last Name (Only for Signup) */}
            {isNewUser && (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    className={`input input-bordered ${
                      errors.firstName ? "input-error" : ""
                    }`}
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.firstName}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    className={`input input-bordered ${
                      errors.lastName ? "input-error" : ""
                    }`}
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.lastName}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-control mt-4">
              <label className="label py-1">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="emailId"
                placeholder="Enter your email"
                className={`input input-bordered ${
                  errors.email ? "input-error" : ""
                }`}
                value={formData.emailId}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label py-1">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className={`input input-bordered ${
                  errors.password ? "input-error" : ""
                }`}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password}
                  </span>
                </label>
              )}
            </div>

            {/* Forgot Password Link (Only for Login) */}
            {!isNewUser && (
              <label className="label mt-2">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            )}

            {/* Auth Error with Close Button */}
            {errors.auth && (
              <div className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                ></svg>
                <span className="text-sm flex-1">{errors.auth}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost btn-circle"
                  onClick={dismissAuthError}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : isNewUser ? (
                  "Create Account"
                ) : (
                  "Login"
                )}
              </button>
            </div>

            {/* Toggle Auth Mode */}
            <div className="text-center mt-4">
              <p className="text-sm">
                {isNewUser
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  type="button"
                  className="link link-primary ml-2 font-semibold"
                  onClick={toggleAuthMode}
                  disabled={loading}
                >
                  {isNewUser ? "Login here" : "Sign up here"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
