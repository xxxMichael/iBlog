import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";

function LoginwGmail({ handleBackToLoginClick }) {
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const clientID =
    "545268428713-io34r3mhfjri0jpvt4v7tn9frsi022so.apps.googleusercontent.com";
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Initialize errorMessage to null

  const handleLogin = () => {
    const data = {
      email: user.email,
    };
    fetch("http://ec2-54-94-110-73.sa-east-1.compute.amazonaws.com:3000/loginwGmail", {
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
          setLoginSuccessful(true);
        } else {
          console.log("sin usuario");
          setLoginSuccessful(false);
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
    handleLogin();
    setUser(response.profileObj);
    // setLoggedIn(true);
  };

  const onFailure = (response) => {
    console.log("Something went wrong");
  };

  const handleLogout = () => {
    setUser({});
    setLoggedIn(false);
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
    // Clear error message after 3.5 seconds
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div className="center">
      <h1>Login with Google</h1>

      <div className="btn">
        {!loggedIn ? (
          <GoogleLogin
            clientId={clientID}
            onSuccess={onSuccess}
            onFailure={onFailure}
            buttonText="Continue with Google"
            cookiePolicy={"single_host_origin"}
          />
        ) : null}
      </div>
      <button onClick={handleBackToLoginClick}>Back to Login</button>

      {errorMessage && ( // Show error message if it exists
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
