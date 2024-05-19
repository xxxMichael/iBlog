/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";

// eslint-disable-next-line react/prop-types
function LoginwGmail({ handleBackToLoginClick }) {
  const clientID =
    "799659145752-cgsgfheos3279f3b0ec30abdn42pffkt.apps.googleusercontent.com";
  const [user, setUser] = useState(null); // Initially, no user is logged in
  const [errorMessage, setErrorMessage] = useState(null); // Initialize errorMessage to null

  const handleLogin = (user) => {
    const data = {
      email: user.email,
    };
    fetch("http://localhost:3000/loginWGmail", {
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
            location.reload();
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
    console.log("Something went wrong");
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
    <div className="center">
      <h1 className="titulo">LOGIN WITH GOOGLE</h1>
      <div className="btnG">
        <GoogleLogin
          clientId={clientID}
          onSuccess={onSuccess}
          onFailure={onFailure}
          buttonText="Continue with Google"
          cookiePolicy={"single_host_origin"}
        />
      </div>
      
      <button className='btnRegreso' onClick={handleBackToLoginClick}>Back to Login</button>

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
