/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Atropos from "atropos/react";
import "./Login.css";
import "atropos/css";
import Home from "../Home/Home";
import Registro from "../Login/Registro";
import LoginwGmail from "../Login/LoginwGmail";
import RegistroGmail from "../Login/RegistrowGmail";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showSignWithGmail, setshowSignWithGmail] = useState(false);
  const [showLoginWithGmail, setShowLoginWithGmail] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result.token);

      if (result.token) {
        localStorage.setItem("token", result.token);
        setLoginSuccessful(true);
      } else {
        setLoginSuccessful(false);
      }
    } catch (error) {
      console.error('Fetch failed:', error.message);
      setLoginSuccessful(false); // Maneja el fallo de la solicitud de inicio de sesión
    }
  };

  const handleSignUpClick = () => {
    setShowSignUpForm(true);
  };

  const handleBackToLoginClick = () => {
    setShowSignUpForm(false);
    setShowLoginWithGmail(false);
    setshowSignWithGmail(false); // Asegúrate de ocultar también el formulario de registro con Gmail al volver al login
  };

  const handleSignUp = (e) => {
    e.preventDefault();
  };

  const handleLoginWithGmailClick = () => {
    setShowLoginWithGmail(true);
  };

  const handleSignnWithGmailClick = () => {
    setshowSignWithGmail(true);
  };

  return (
    <>
      {loginSuccessful ? (
        <Home />
      ) : (
        <div className="centered-div" id="app">
          <Atropos activeOffset={15} shadowScale={0}>
            <div className="login-panel">
              {showSignUpForm ? (
                <Registro
                  handleBackToLoginClick={handleBackToLoginClick}
                  handleSignUp={handleSignUp}
                />
              ) : showLoginWithGmail ? (
                <LoginwGmail
                  handleBackToLoginClick={handleBackToLoginClick}
                  handleLogin={handleLogin}
                />
              ) : showSignWithGmail ? (
                <RegistroGmail
                  handleBackToLoginClick={handleBackToLoginClick}
                  handleSignUp={handleSignUp}
                />
              ) : (
                <>
                  <h1 className="titulo" data-atropos-offset="7">BIENVENIDO A ¡BLOG</h1>
                  <div className="options" data-atropos-offset="5">
                    <button className="btnSEmail" onClick={handleSignUpClick}>
                      Sign up with email
                    </button>
                    <button className="btnLGmail" onClick={handleLoginWithGmailClick}>
                      Login with Gmail
                    </button>
                    <button className="btnSGmail" onClick={handleSignnWithGmailClick}>
                      Sign up with Gmail
                    </button>
                  </div>
                  <div className="inputs" data-atropos-offset="6">
                    <div className="container1">
                      <input
                        onChange={(event) => {
                          setUsername(event.target.value);
                        }}
                        placeholder="Usuario"
                        type="text"
                        id="txtusername"
                        className="input"
                      />
                    </div>
                    <div className="container1">
                      <input
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                        type="password"
                        placeholder="Password"
                        id="txtpassword"
                        className="input"
                      />
                    </div>
                    <div className="button-container">
                      <button type="button" onClick={handleLogin} className="button">
                        <div className="button-top">LOGIN</div>
                        <div className="button-bottom"></div>
                        <div className="button-base"></div>
                      </button>
                    </div>
                  </div>
                  <a href='' className="enlaceContraseña">Forgot password</a>
                </>
              )}
            </div>
          </Atropos>
        </div>
      )}
    </>
  );
};

export default Login;
