import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
import "./regwgmail.css"; // Importa tu archivo CSS aquí

function RegistrowGmail({ handleBackToLoginClick }) {
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const clientID =
    "545268428713-at1b5ore5jp9tcg4nikbgkbs4sso1flm.apps.googleusercontent.com";
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
        fetch("http://52.67.196.92:3000/checkUsername", {
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
    if (password.length < 6) {
      setErrorMessage({
        message: "Las contraseña es muy corta",
        type: "error",
      });
      return;
    }
    if (password.length > 20) {
      setErrorMessage({
        message: "Las contraseña es muy larga",
        type: "error",
      });
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage({
        message: "Las contraseñas no coinciden",
        type: "error",
      });
      return;
    }

    const data = {
      email: user.email,
      username: username,
      password: password,
      nombre: user.name,
      apellido: user.last_name,
    };

    console.log("Data to be sent to the server:", data);

    fetch("http://52.67.196.92:3000/registrarGmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log("User inserted successfully:", result);
          setErrorMessage({
            message:
              "Usuario registrado exitosamente. Por favor, inicie sesión.",
            type: "success",
          });
          // Optionally, redirect to login page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Redirect or reload after 2 seconds
        } else {
          setErrorMessage({
            message: result.message || "Error al insertar el usuario",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage({
          message: "Error interno del servidor",
          type: "error",
        });
      });
  };

  const onSuccess = (response) => {
    fetch("http://52.67.196.92:3000/verfRegistro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correoElectronico: response.profileObj.email }), // Asegúrate de enviar el correo electrónico correctamente
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Usuario existente") {
          setErrorMessage({
            message:
              "El usuario ya tiene una cuenta",
            type: "error",
          });
          setShowLoginForm(false);
          return;
          // No mostramos el formulario de login

        } else if (
          data.message === "El usuario está pendiente de autenticación"
        ) {
          setErrorMessage({
            message:
              "Usuario debe verificarse",
            type: "error",
          });
          // No mostramos el formulario de login
          setShowLoginForm(false);
        } else {
          console.log(data.message);
          setUser(response.profileObj);
          setShowLoginForm(true); // Solo mostramos el formulario de login si el usuario no existe y no está pendiente de verificación
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setErrorMessage({
          message:
            "Error de servidor",
          type: "error",
        });
        setShowLoginForm(false); // No mostramos el formulario de login en caso de error
      });
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
    // Clear error message after 3.5 seconds
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div className="center">
      <h1 data-atropos-offset="7" className="titulo">Register with Google</h1>
      <div className="btnContainerG">
        <button id="btnSalir" data-atropos-offset="20" className="btnRegresoLogin" onClick={handleBackToLoginClick} >
          <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
          <div className="text">Return to Login</div>
        </button>
      </div>
      <div data-atropos-offset="7" className="btnContainerG">
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
      </div>
      <div data-atropos-offset="7" className="btnContainerG">
        {errorMessage && !showLoginForm && ( // Show error message if it exists
          <div
            style={{
              backgroundColor:
                errorMessage.type === "error" ? "red" : "green",
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
      {showLoginForm && (
        <div className="container">
          <div className="input-container">
            <div data-atropos-offset="7" className="inputBox">
              <input required className="inputRL" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              <span>Username</span>
            </div>
            {username.trim().length >= 4 && username.trim().length <= 20 &&
              usernameAvailable && ( // Muestra el mensaje "username disponible" solo si el nombre de usuario tiene al menos 4 caracteres y está disponible
                <p
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    margin: "5px 0",
                    fontSize: "14px",
                  }}
                >
                  ¡Username disponible!
                </p>
              )}
            {usernameExists && ( // Muestra el mensaje de error si el nombre de usuario ya existe
              <p
                style={{
                  backgroundColor: "red",
                  color: "white",
                  margin: "5px 0",
                  fontSize: "14px",
                }}
              >
                ¡El nombre de usuario ya existe!
              </p>
            )}
          </div>
          <div data-atropos-offset="7" className="inputBox">
            <input required type="password" className="inputRL" value={password} onChange={(e) => setPassword(e.target.value)} />
            <span>Password</span>
          </div>
          <div data-atropos-offset="7" className="inputBox">
            <input required type="password" className="inputRL" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <span>Confirm Password</span>
          </div>
          <div data-atropos-offset="5" className="button-container">
            <button
              className={`btnregistroG ${(!usernameAvailable || username.trim().length < 4 || !password || password !== confirmPassword
                || password.length < 6 || password.length > 20 || username.trim().length >20) ? 'disabled' : 'enabled'}`}
              onClick={handleLogin}
              disabled={!usernameAvailable || username.trim().length < 4 || !password || !confirmPassword || password !== confirmPassword
                || password.length < 6 || password.length > 20 || username.trim().length >20}
            >
              Register
            </button>
            <div className="tooltip">
              <div className="icon">i</div>
              <div className="tooltiptext">Username mayor a 4 y menor a 20, Password mayor a 6 y menor a 20, password coincidan</div>
            </div>
          </div>
          <div data-atropos-offset="7" className="inputBox">
            {errorMessage && ( // Show error message if it exists
              <div
                style={{
                  backgroundColor:
                    errorMessage.type === "error" ? "red" : "green",
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
        </div>
      )}
    </div>
  );
}

export default RegistrowGmail;
