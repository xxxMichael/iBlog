import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
import "./regwgmail.css"; // Importa tu archivo CSS aquí

function RegistrowGmail({ handleBackToLoginClick }) {
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const clientID =
    "799659145752-cgsgfheos3279f3b0ec30abdn42pffkt.apps.googleusercontent.com";
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Initialize errorMessage to null
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  useEffect(() => {
    function checkUsernameExists() {
      if (username.trim().length >= 4) {
        fetch("http://localhost:3000/checkUsername", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username }), // Envía el nombre de usuario en el cuerpo de la solicitud
        })
          .then((response) => response.json())
          .then((data) => {
            setUsernameExists(data.exists);
            setUsernameAvailable(!data.exists); // Actualiza el estado para indicar si el nombre de usuario está disponible
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else {
        setUsernameExists(false);
        setUsernameAvailable(false);
      }
    }

    checkUsernameExists();
  }, [username]);

  const handleLogin = () => {
    if (password !== confirmPassword) {
      setErrorMessage({ message: "Las contraseñas no coinciden", type: "error" });
      return;
    }

    const data = {
      email: user.email,
      username: username,
      password: password
    };

    fetch("http://localhost:3000/loginwGmail", {
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
          setErrorMessage({ message: 'Usuario no encontrado. Por favor regístrese.', type: 'error' }); // Set error message
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage({ message: 'Error interno del servidor', type: 'error' }); // Set error message
      });
  };

  const onSuccess = (response) => {
    setUser(response.profileObj);
    setShowLoginForm(true);
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
      <h1>Register with Google</h1>

      <div className="btn">
        {!loggedIn && !showLoginForm ? (
          <GoogleLogin
            clientId={clientID}
            onSuccess={onSuccess}
            onFailure={onFailure}
            buttonText="Continue with Google"
            cookiePolicy={"single_host_origin"}
          />
        ) : null}
      </div>

      {showLoginForm && (
        <div className="container">
          <div className="input-container">
            <p style={{ backgroundColor: "green",color: "white"}}>Por favor ingresa estos datos para terminar el registro de tu cuenta:</p>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {username.trim().length >= 4 && usernameAvailable && ( // Muestra el mensaje "username disponible" solo si el nombre de usuario tiene al menos 4 caracteres y está disponible
              <p style={{  backgroundColor: "green",color: "white", margin: "5px 0", fontSize: "14px" }}>
                ¡Username disponible!
              </p>
            )}
            {usernameExists && ( // Muestra el mensaje de error si el nombre de usuario ya existe
             <p style={{ backgroundColor: "red", color: "white", margin: "5px 0", fontSize: "14px" }}>
             ¡El nombre de usuario ya existe!
           </p>
           
            )}
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="btn-container">
            <button onClick={handleLogin} disabled={!usernameAvailable || username.trim().length < 4 || !password || password !== confirmPassword}>Register</button>
          </div>
        </div>
      )}

      <button onClick={handleBackToLoginClick} disabled={showLoginForm} style={{ marginTop: "10px" }}>Back to Login</button>

      {errorMessage && ( // Show error message if it exists
        <div className={errorMessage.type === "error" ? "error-message" : "success-message"}>
          {errorMessage.message}
        </div>
      )}
    </div>
  );
}

export default RegistrowGmail;
