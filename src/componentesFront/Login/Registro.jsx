import React, { useState, useEffect } from "react";

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

    // Enviar datos al manejador de registro
    handleSignUp({
      email,
      password,
      firstName,
      lastName,
      username,
      dob,
      country,
    });
  };

  return (
    <form className="registration-form" onSubmit={handleSignUpSubmit}>
      <h2>Registrar por email</h2>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Ingrese su correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirme su contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="firstName">Nombre:</label>
        <input
          type="text"
          id="firstName"
          placeholder="Ingrese su nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Apellido:</label>
        <input
          type="text"
          id="lastName"
          placeholder="Ingrese su apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="username">Nombre de usuario:</label>
        <input
          type="text"
          id="username"
          placeholder="Ingrese su nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="dob">Fecha de nacimiento:</label>
        <input
          type="date"
          id="dob"
          placeholder="Ingrese su fecha de nacimiento"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="country">País:</label>
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
      <button type="submit">Registrarse</button>
      <button type="button" onClick={handleBackToLoginClick}>
        Regresar a inicio de sesión
      </button>
      {isVisible && (
        <div
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
    </form>
  );
};

export default Registro;
