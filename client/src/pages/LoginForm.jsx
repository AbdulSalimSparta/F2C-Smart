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

    const endpoint = isUserRegistered 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/register';

    const payload = isUserRegistered 
      ? { email, password }
      : { email, password, username };

    try {
      const response = await axios.post(endpoint, payload);
      console.log("Response Data:", response.data);

      if (response.status === 200) {
        const { token, role } = response.data;
        if (!token) {
          console.error("Token missing in response");
          return setMessage("Token not received from server");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        console.log("Stored Token:", localStorage.getItem("token"));
        console.log("Stored Role:", localStorage.getItem("role"));

        setMessage(isUserRegistered ? "Login successful" : "Registration successful");

        // Role-based navigation
        if (isUserRegistered) {
          if (role === "customer") {
            navigate("/");
          } else if (role === "seller") {
            navigate("/seller-home");
          } else if (role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/"); // Default
          }
        } else {
          handleClick(); // After registration go to login
        }
      } else {
        setMessage(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("Error: " + (error.response?.data?.message || error.message));
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
        <InputBox
          type="password"
          id="conf-password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
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
