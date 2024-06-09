/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import Atropos from "atropos/react";
import "./Login.css";
import "atropos/css";
import Home from "../Home/Home";
import Registro from "../Login/Registro";
import LoginwGmail from "../Login/LoginwGmail";
import RegistroGmail from "../Login/RegistrowGmail";
import RecuperarContrasena from "../Login/RecuperarContra";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showSignWithGmail, setshowSignWithGmail] = useState(false);
  const [showLoginWithGmail, setShowLoginWithGmail] = useState(false);
  const [showRecuperarContrasena, setShowRecuperarContra] = useState(false); // Nuevo estado para recuperación de contraseña
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (errorMessage) {
      setIsVisible(true);
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    } else {
      setIsVisible(false);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage]);

  const getColor = () => {
    if (errorMessage && errorMessage.type === "error") {
      return "red";
    } else if (errorMessage && errorMessage.type === "success") {
      return "green";
    } else {
      return "black";
    }
  };
  const linkRef = useRef(null);

  useEffect(() => {
    if (loginSuccessful) {
      linkRef.current.click();
    }
  }, [loginSuccessful]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password,
    };
    if (username === "") {
      setErrorMessage({
        message: "Ingrese un nombre de Usuario o Correo",
        type: "error",
      });
      return;
    } else if (password === "") {
      setErrorMessage({
        message: "Ingrese una Contraseña",
        type: "error",
      });
      return;
    }
    try {
      const response = await fetch("http://52.67.196.92:3000/loginController", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setErrorMessage({
          message: "Usuario no encontrado (verifica tu nombre o contraseña)",
          type: "error",
        });
        return;
      }

      const result = await response.json();
      console.log(result.token);

      if (result.token) {
        localStorage.setItem("token", result.token);
        setLoginSuccessful(true);
       //navigate("/");
        window.location.reload();
      } else {
        setErrorMessage({
          message: result.message || "Error al obtener el token",
          type: "error",
        });
        setLoginSuccessful(false);
      }
    } catch (error) {
      console.error('Fetch failed:', error.message);
      setErrorMessage({
        message: "Error interno del servidor",
        type: "error",
      });
      setLoginSuccessful(false); // Maneja el fallo de la solicitud de inicio de sesión
    }
  };
  const mostrarContraseña = () => {
    const password = document.getElementById("txtpassword");
    const togglePassword = document.getElementById('togglePassword');
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
  }
  const handleSignUpClick = () => {
    setShowSignUpForm(true);
  };

  const handleBackToLoginClick = () => {
    setShowSignUpForm(false);
    setShowLoginWithGmail(false);
    setshowSignWithGmail(false);
    setShowRecuperarContra(false); // Asegúrate de ocultar también el formulario de recuperación de contraseña al volver al login
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

  const handleRecuperarContralick = () => {
    setShowRecuperarContra(true); // Mostrar el componente de recuperación de contraseña
  };

  return (
    <>
      {loginSuccessful ? (
        <Link to='/' ref={linkRef} id='redirección'></Link>
      ) : (
        <div className="centered-div" id="app">
          <Atropos activeOffset={15} shadowScale={1}>
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
              ) : showRecuperarContrasena ? ( // Mostrar el componente de recuperación de contraseña
                <RecuperarContrasena
                  handleBackToLoginClick={handleBackToLoginClick}
                />
              ) : (
                <>
                  <h1 className="titulo" data-atropos-offset="7">BIENVENIDO A ¡BLOG</h1>
                  <div className="options" data-atropos-offset="9">
                    <button className="btnSEmail" onClick={handleSignUpClick}>
                      Register with email
                    </button>
                    <button className="btnLGmail" onClick={handleLoginWithGmailClick}>
                      Login with Gmail
                    </button>
                    <button className="btnSGmail" onClick={handleSignnWithGmailClick}>
                      Register with Gmail
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
                      <div className="password_container">
                        <input
                          onChange={(event) => {
                            setPassword(event.target.value);
                          }}
                          type="password"
                          placeholder="Password"
                          id="txtpassword"
                          className="input"
                        />
                        <span id="togglePassword" onClick={mostrarContraseña} className="toggle-password">🔒</span>
                      </div>
                    </div>
                    <div className="button-container">
                      <button type="button" onClick={handleLogin} className="button">
                        <div className="button-top">LOGIN</div>
                        <div className="button-bottom"></div>
                        <div className="button-base"></div>
                      </button>
                    </div>
                  </div>
                  <button data-atropos-offset="10" onClick={handleRecuperarContralick} className="buttonRC">
                    Recuperar Contraseña
                  </button>
                  {isVisible && (
                    <div data-atropos-offset="7" className="mensageError"
                      style={{
                        backgroundColor: getColor(),
                        padding: "10px",
                        borderRadius: "5px",
                        margin: "10px 0",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {errorMessage.message}
                    </div>
                  )}
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
