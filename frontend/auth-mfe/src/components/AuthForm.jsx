import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import jwtDecode from "jwt-decode"; 
import "bootstrap/dist/css/bootstrap.min.css";

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const AuthForm = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [signup] = useMutation(SIGNUP_MUTATION);
  const [login] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      if (isSignup) {
        const { data } = await signup({ variables: formData });
        console.log("Signup Success:", data.signup);
        setSuccessMessage("Signup successful! Welcome!");
      } else {
        const { data } = await login({ variables: { email: formData.email, password: formData.password } });
        console.log("Login Response:", data); // Log the entire response
  
        const userId = data?.login?.user?.id;
        if (!userId) {
          throw new Error("User ID is missing in login response.");
        }
  
        localStorage.setItem("userId", userId); // Store userId in localStorage
        localStorage.setItem("token", data.login.token); // Store token
        console.log("User ID stored in localStorage:", userId);
  
        setSuccessMessage("Login successful! Redirecting...");
        //Reload the page to redirect to the Vital Signs Micro Frontend
        window.location.reload();
        // window.location.href = "http://localhost:4174/"; // Redirect to Vital Signs Micro Frontend

      }
    } catch (err) {
      console.error("Login Error:", err.message);
      setErrorMessage(err.message);
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">{isSignup ? "Sign Up" : "Log In"}</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
              {isSignup && (
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                {isSignup ? "Sign Up" : "Log In"}
              </button>
            </form>
            <p className="text-center mt-3">
              {isSignup ? "Already have an account?" : "Need an account?"}{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Log In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
