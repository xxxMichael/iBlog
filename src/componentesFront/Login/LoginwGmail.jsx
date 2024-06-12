/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { host } from '../Home/Home';

// eslint-disable-next-line react/prop-types
function LoginwGmail({ handleBackToLoginClick }) {
  const navigate = useNavigate();

  const clientID =
    "156003158373-sqloa88ehv8003k3d8i7k4v6a9112vvs.apps.googleusercontent.com";
  const [user, setUser] = useState(null); // Initially, no user is logged in
  const [errorMessage, setErrorMessage] = useState(null); // Initialize errorMessage to null

  const handleLogin = (user) => {
    const data = {
      email: user.email,
    };
    fetch(`http://${host}:3000/loginWGmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.token);
        if (result.token) {
          localStorage.setItem("token", result.token);
          console.log(result.token);
          setErrorMessage({
            message: "Redirigiendo a Home...",
            type: "success",
          }); // Set error message
          setTimeout(function () {
            navigate("/");
            window.location.reload();
          }, 500);
        } else {
          console.log("sin usuario");
          setErrorMessage({
            message: "Usuario no encontrado  Por favor registrese",
            type: "error",
          }); // Set error message
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage({
          message: "Error interno del servidor",
          type: "error",
        }); // Set error message
      });
  };

  const onSuccess = (response) => {
    setUser(response.profileObj);
  };

  const onFailure = (response) => {
    console.log("Something went wrong", response.error);
  };



  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientID,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  useEffect(() => {
    if (user) {
      handleLogin(user);
    }
  }, [user]); // Only run handleLogin when user state changes

  useEffect(() => {
    // Clear error message after 3.5 seconds
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div className="CentroGmail">
      <h1 data-atropos-offset="7" className="titulo">LOGIN WITH GOOGLE</h1>
      <div className="btnContainerG">
        <button data-atropos-offset="20" className="btnRegresoLogin" onClick={handleBackToLoginClick}>
          <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
          <div className="text">Return to Login</div>
        </button>
      </div>
      <div className="btnContainerG">
        <div data-atropos-offset="7" className="btnG">
          <GoogleLogin
            clientId={clientID}
            onSuccess={onSuccess}
            onFailure={onFailure}
            buttonText="Continue with Google"
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </div>
      {errorMessage && ( // Show error message if it exists|
        <div
          style={{
            backgroundColor: errorMessage.type === "error" ? "red" : "green",
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
    </div>


  );
}

export default LoginwGmail;
