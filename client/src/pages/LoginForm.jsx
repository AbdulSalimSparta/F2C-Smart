import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import '../styles/Login.css';

function LoginForm() {
  const [isUserRegistered, setIsUserRegistered] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUserName] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    setIsUserRegistered(prevState => !prevState);
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    setMessage('');

    if (!isUserRegistered && password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Use full API URL to avoid 404 error
    const endpoint = isUserRegistered ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
    const payload = isUserRegistered 
      ? { email, password }  // For login, only send email and password
      : { email, password, username };  // For registration, send email, password, and username

    try {
      const response = await axios.post(endpoint, payload);
      if (response.status === 200) {
        setMessage(isUserRegistered ? "Login successful" : "Registration successful");
        
        // Save the JWT token to localStorage for future requests
        localStorage.setItem('token', response.data.token);

        // Redirect based on the action (login or register)
        isUserRegistered ? navigate('/') : handleClick();  // Navigate to the homepage for login
      } else {
        setMessage(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  }

  return (
    <form className="form iptbcontainer container" onSubmit={handleFormSubmit}>
      {!isUserRegistered && (
        <InputBox
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
      )}
      <InputBox
        type="email"
        id="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputBox
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {!isUserRegistered && (
        <>
          <InputBox
            type="password"
            id="conf-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      )}
      
      <Button type="submit" id="login-btn" text={isUserRegistered ? "Login" : "Register"} />

      {isUserRegistered ? (
        <p className="forget">
          Forgot Password / New User? <a href="#" onClick={handleClick}>Click Here</a>
        </p>
      ) : (
        <p className="forget">
          Already a User? <a href="#" onClick={handleClick}>Click Here</a>
        </p>
      )}

      {message && <p>{message}</p>}
    </form>
  );
}

export default LoginForm;
