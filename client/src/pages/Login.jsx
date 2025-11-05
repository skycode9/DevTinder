// import axios from "axios";
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addUser } from "../utils/userSlice";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from "../config/baseurl";
// const Login = () => {
//   const [isNewUser, setIsNewUser] = useState(false);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [emailId, setEmailId] = useState("");
//   const [password, setPassword] = useState("");
//   const [authError, setAuthError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const validateForm = () => {
//     let isValid = true;

//     // Reset errors
//     setEmailError("");
//     setPasswordError("");

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailId || !emailRegex.test(emailId)) {
//       setEmailError("Please enter a valid email address");
//       isValid = false;
//     }

//     // Password validation
//     if (!password || password.length < 6) {
//       setPasswordError("Password must be at least 6 characters long");
//       isValid = false;
//     }

//     return isValid;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     try {
//       const result = await axios.post(
//         BASE_URL + "/login",
//         {
//           emailId,
//           password,
//         },
//         { withCredentials: true }
//       );
//       const userData = result?.data?.data;
//       dispatch(addUser(userData));

//       setEmailId("");
//       setPassword("");
//       navigate("/feed");
//     } catch (error) {
//       console.log("Axios Error: ", error);
//       setAuthError(error?.response?.data?.msg || "Something went wrong");
//     }
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     try {
//       const res = await axios.post(
//         BASE_URL + "/signup",
//         {
//           firstName,
//           lastName,
//           emailId,
//           password,
//         },
//         { withCredentials: true }
//       );
//       const newUserData = res?.data?.data;
//       dispatch(addUser(newUserData));
//       setFirstName("");
//       setLastName("");
//       setEmailId("");
//       setPassword("");
//       navigate("/profile");
//     } catch (error) {
//       console.log("Axios Error: " + error);
//       console.log("Error Message: " + error?.response?.data?.err);
//       setAuthError(error?.response?.data?.err || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center">
//       <div className="card w-full max-w-sm shadow-2xl bg-base-100">
//         <div className="card-body">
//           <h2 className="text-center text-2xl font-bold">
//             {isNewUser ? "Sign Up" : "Login"}
//           </h2>

//           <form>
//             {isNewUser && (
//               <>
//                 <div className="form-control">
//                   <label className="label py-1">
//                     <span className="label-text">First Name</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter First Name"
//                     className="input input-bordered"
//                     required
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                   />
//                 </div>

//                 <div className="form-control mt-4">
//                   <label className="label py-1">
//                     <span className="label-text">Last Name</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter Last Name"
//                     className="input input-bordered"
//                     required
//                     value={lastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                   />
//                 </div>
//               </>
//             )}

//             {/* Email */}
//             <div className="form-control mt-4">
//               <label className="label py-1">
//                 <span className="label-text">Email</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="Enter email"
//                 className="input input-bordered"
//                 required
//                 value={emailId}
//                 onChange={(e) => setEmailId(e.target.value)}
//               />
//             </div>
//             {emailError && (
//               <p className="text-red-500 text-sm mt-1">{emailError}</p>
//             )}

//             {/* Password */}
//             <div className="form-control mt-4">
//               <label className="label py-1">
//                 <span className="label-text">Password</span>
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter password"
//                 className="input input-bordered"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             {passwordError && (
//               <p className="text-red-500 text-sm mt-1">{passwordError}</p>
//             )}

//             {/* Submit Button */}
//             <div className="form-control mt-4">
//               {isNewUser ? (
//                 <button className="btn btn-primary" onClick={handleSignUp}>
//                   SignUp
//                 </button>
//               ) : (
//                 <button className="btn btn-primary" onClick={handleLogin}>
//                   Login
//                 </button>
//               )}
//             </div>
//             {!isNewUser && (
//               <label className="label mt-3">
//                 <a href="#" className="label-text-alt link link-hover">
//                   Forgot password?
//                 </a>
//               </label>
//             )}

//             <div className="mt-3">
//               {isNewUser ? (
//                 <p>
//                   Existing User?
//                   <span
//                     className="underline cursor-pointer ml-2"
//                     onClick={() => setIsNewUser((prev) => !prev)}
//                   >
//                     Login Here
//                   </span>
//                 </p>
//               ) : (
//                 <p>
//                   New User?
//                   <span
//                     className="underline cursor-pointer ml-2"
//                     onClick={() => setIsNewUser((prev) => !prev)}
//                   >
//                     SignUp Here
//                   </span>
//                 </p>
//               )}
//             </div>

//             {authError && (
//               <p className="text-red-500 shadow-2xl">{authError}</p>
//             )}
//           </form>

//           {/* Divider */}
//           <div className="divider">OR</div>

//           {/* Google Login (example) */}
//           <button className="btn btn-outline w-full">
//             Continue with Google
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// pages/Login.jsx - Improved Version
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
    const newErrors = { email: "", password: "", auth: "" };
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
        newErrors.auth = "First name is required";
        isValid = false;
      }
      if (!formData.lastName?.trim()) {
        newErrors.auth = "Last name is required";
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
        { withCredentials: true }
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
        { withCredentials: true }
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
    setErrors({ email: "", password: "", auth: "" });
    setFormData({ firstName: "", lastName: "", emailId: "", password: "" });
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
                    className="input input-bordered"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    className="input input-bordered"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                  />
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

            {/* Auth Error */}
            {errors.auth && (
              <div className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{errors.auth}</span>
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

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Google Login */}
          <button className="btn btn-outline w-full" disabled={loading}>
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
