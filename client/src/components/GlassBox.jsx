import React from "react";
import LoginForm from "../pages/LoginForm";
import '../styles/Login.css'; 


const LoginHeader = () => (
    <div className="logHeader">
        <span id="loginfrm">
            <h1 id="welcome">Welcome to F2C!</h1>
            <h5 id="conttxt">Enter Details to Continue</h5>
        </span>
    </div>
);

function GlassBox(){
    return (
    <div className="iptbcontainer">
        <div className="boxlogin">
            <LoginHeader />
            <LoginForm /> 
        </div>
    </div>);
}

export default GlassBox;