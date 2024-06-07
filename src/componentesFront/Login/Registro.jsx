import React, { useState, useEffect } from "react";
import AutenticarUser from "./AutenticarUser"; // Importar AutenticarUser

const Registro = ({ handleBackToLoginClick, handleSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // Initialize errorMessage to null
  const [isVisible, setIsVisible] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Nuevo estado para verificar el éxito del registro
  const [usernameExists, setUsernameExists] = useState(false); // Estado para verificar si el username ya existe
  const [usernameAvailable, setUsernameAvailable] = useState(true); // Estado para verificar si el username está disponible
  const [emailExists, setEmailExists] = useState(false); // Estado para verificar si el email ya existe
  const [emailAvailable, setEmailAvailable] = useState(true); // Estado para verificar si el email está disponible

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

  useEffect(() => {
    if (errorMessage && errorMessage.type === "success") {
      // Si el mensaje de error es de tipo "success", establece el éxito del registro en true
      setRegistrationSuccess(true);
    }
  }, [errorMessage]);

  useEffect(() => {
    // Verificar la disponibilidad del nombre de usuario
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
  }, [username]);

  useEffect(() => {
    // Verificar la disponibilidad del email solo si contiene ".com"
    if (email.includes(".com")) {
      fetch("http://52.67.196.92:3000/checkEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }), // Envía el email en el cuerpo de la solicitud
      })
        .then((response) => response.json())
        .then((data) => {
          setEmailExists(data.exists);
          setEmailAvailable(!data.exists); // Actualiza el estado para indicar si el email está disponible
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      setEmailExists(false);
      setEmailAvailable(false);
    }
  }, [email]);

  const getColor = () => {
    if (errorMessage && errorMessage.type === "error") {
      return "red";
    } else if (errorMessage && errorMessage.type === "success") {
      return "green";
    } else {
      return "black";
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validar contraseña: no caracteres especiales y longitud no mayor a 16
    const passwordPattern = /^[a-zA-Z0-9]+$/;
    if (
      !passwordPattern.test(password) ||
      password.length > 16 ||
      password.length < 6
    ) {
      setErrorMessage({
        message:
          "La contraseña debe ser mayor a 6 caracteres, menor a 16 y no debe tener caracteres especiales",
        type: "error",
      });
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErrorMessage({
        message: "Las contraseñas no coinciden",
        type: "error",
      });
      return;
    }

    // Validar nombre y apellido: solo letras y longitud no mayor a 35
    const namePattern = /^[a-zA-Z]+$/;
    if (
      !namePattern.test(firstName) ||
      firstName.length > 35 ||
      !namePattern.test(lastName) ||
      lastName.length > 35 ||
      firstName.length < 3 ||
      lastName.length < 3
    ) {
      setErrorMessage({
        message:
          "Por favor ingrese nombres y apellidos válidos (mínimo 3 caracteres y máximo 35)",
        type: "error",
      });
      return;
    }

    // Validar fecha de nacimiento: debe ser mayor de 18 años
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 18) {
      setErrorMessage({
        message: "Debes ser mayor de 18 años para poder registrarte",
        type: "error",
      });
      return;
    }

    // Validar que se seleccione un país
    if (!country) {
      setErrorMessage({
        message: "Por favor seleccione un país",
        type: "error",
      });
      return;
    }

    // Enviar datos al servidor para registrar el usuario
    const data = {
      email,
      username,
      password,
      nombre: firstName,
      apellido: lastName,
      pais: country,
      fechaNac: dob,
    };

    fetch("http://52.67.196.92:3000/registroNormal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setErrorMessage({
            message: "Registro exitoso. Por favor, inicie sesión.",
            type: "success",
          });
          setRegistrationSuccess(true);

          // Optionally, clear the form fields
          // setEmail("");
          // setPassword("");
          // setConfirmPassword("");
          // setFirstName("");
          // setLastName("");
          // setUsername("");
          // setDob("");
          // setCountry("");
        } else {
          setErrorMessage({
            message: result.message || "Error al registrar el usuario.",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage({
          message: "Error interno del servidor.",
          type: "error",
        });
      });
  };
  const isButtonDisabled = !usernameAvailable || username.trim().length < 4 || !emailAvailable || email.trim().length === 0;

  return (
    <div className="Registro_C">
      {registrationSuccess ? (
        <AutenticarUser /> // Renderizar AutenticarUser si el registro es exitoso
      ) : (
        <>
          <h1 data-atropos-offset="7" className="titulo">REGISTRO</h1>
          <button data-atropos-offset="20" className="btnRegresoLogin" onClick={handleBackToLoginClick}>
            <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
            <div className="text">Return to Login</div>
          </button>
          <form className="registration-form" onSubmit={handleSignUpSubmit}>
            <div className="input-column">
              <div data-atropos-offset="7" className="inputBox">
                <input required type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <span>Gmail</span>
                {email.trim().length > 0 &&
                  emailExists && ( // Muestra el mensaje de error si el correo electrónico ya existe
                    <p
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        margin: "5px 0",
                        fontSize: "14px",
                      }}
                    >
                      ¡Email ya registrado!
                    </p>
                  )}
              </div>
              <div data-atropos-offset="7" className="inputBox">
                <input required type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span>Password</span>
              </div>
              <div data-atropos-offset="7" className="inputBox">
                <input required type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <span>Name</span>
              </div>
              <div data-atropos-offset="7" className="inputBox">
                <input required type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <span>Confirm Password</span>
              </div>
              <div data-atropos-offset="7" className="inputBox">
                <input required type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <span>Lastname</span>
              </div>
              <div data-atropos-offset="7" className="inputBox">
                <input required type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <span>Username</span>
                {username.trim().length >= 4 &&
                  usernameExists && ( // Muestra el mensaje de error si el nombre de usuario ya existe
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
                <input className="fecha" required type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
                <span>Birthdate</span>
              </div>
              <div data-atropos-offset="7" className="inputBox">
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  <option value="">Seleccione su país</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Chile">Chile</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Dominicana">República Dominicana</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Honduras">Honduras</option>
                  <option value="México">México</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Panamá">Panamá</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Perú">Perú</option>
                  <option value="Puerto Rico">Puerto Rico</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Venezuela">Venezuela</option>
                </select>
              </div>
            </div>
            <div data-atropos-offset="5" className="button-container">
              <button
                className={`btnRegisterE ${isButtonDisabled ? 'disabled' : 'enabled'}`}
                style={{
                  backgroundColor: isButtonDisabled ? 'red' : 'initial', // Rojo si está deshabilitado
                }}
                disabled={isButtonDisabled}
              >
                <span>Register</span><i></i>
              </button>
            </div>
          </form>
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
  );
};

export default Registro;
