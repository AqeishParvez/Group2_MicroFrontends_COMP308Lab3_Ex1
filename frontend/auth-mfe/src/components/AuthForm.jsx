import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

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
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isSignup, setIsSignup] = useState(true);

  const [signup] = useMutation(SIGNUP_MUTATION);
  const [login] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const { data } = await signup({ variables: formData });
        console.log('Signup Success:', data.signup);
      } else {
        const { data } = await login({ variables: { email: formData.email, password: formData.password } });
        console.log('Login Success:', data.login);
        localStorage.setItem('token', data.login.token);
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isSignup && (
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">{isSignup ? 'Sign Up' : 'Log In'}</button>
      <p onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Log in' : 'Need an account? Sign up'}
      </p>
    </form>
  );
};

export default AuthForm;