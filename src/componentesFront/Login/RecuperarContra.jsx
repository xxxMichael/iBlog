import React, { useState, useEffect } from "react";
import './Login.css';
import { host } from '../Home/Home';

const RecuperarContra = ({ handleBackToLoginClick }) => {
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [message, setMessage] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false); // Estado de carga para enviar el correo
  const [updatingPassword, setUpdatingPassword] = useState(false); // Estado de carga para actualizar la contraseña
  const [verificationError, setVerificationError] = useState(""); // Mensaje de error para código de verificación
  const [passwordError, setPasswordError] = useState(""); // Mensaje de error para contraseñas
  const [validEmailFormat, setValidEmailFormat] = useState(false); // Control de formato de email válido

  useEffect(() => {
    if (email.includes(".com")) {
      setValidEmailFormat(true);
      fetch(`https://${host}/checkEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((data) => {
          setEmailExists(data.exists);
          setEmailAvailable(!data.exists);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      setValidEmailFormat(false);
      setEmailExists(false);
      setEmailAvailable(false);
    }
  }, [email]);

  useEffect(() => {
    // Verificar si las contraseñas coinciden
    if (newPassword === confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }

    // Verificar si la nueva contraseña cumple con los requisitos
    const passwordRegex = /^[A-Za-z0-9]+$/;
    if (newPassword.length > 6 && passwordRegex.test(newPassword)) {
      setPasswordError("");
    } else {
      setPasswordError("La contraseña debe tener más de 6 caracteres y solo contener números y letras.");
    }
  }, [newPassword, confirmPassword]);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleVerificationChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailExists) {
      setMessage("¡Este Email no se encuentra registrado!");
      return;
    }

    try {
      setSendingEmail(true); // Activar el estado de carga
      const response = await fetch(`https://${host}/emailController`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Código de recuperación enviado a ${email}`);
        localStorage.setItem("verificationCode", data.code);
        setShowVerification(true);
        setEmailSent(true);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setMessage(
        "Error al realizar la solicitud. Por favor, intenta de nuevo."
      );
    } finally {
      setSendingEmail(false); // Desactivar el estado de carga
    }
  };

  const handleVerificationSubmit = async (event) => {
    event.preventDefault();
    const storedCode = localStorage.getItem("verificationCode");

    if (verificationCode !== storedCode) {
      setVerificationError("El código de verificación es incorrecto.");
      return;
    }

    setVerificationError(""); // Limpiar el mensaje de error

    if (!passwordsMatch) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setUpdatingPassword(true); // Activar el estado de carga
      const response = await fetch(`https://${host}/actualizarContra`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Contraseña actualizada con éxito.");
        localStorage.removeItem("verificationCode");
        setTimeout(() => {
          setShowVerification(false);
        }, 3000);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setMessage(
        "Error al realizar la solicitud. Por favor, intenta de nuevo."
      );
    } finally {
      setUpdatingPassword(false); // Desactivar el estado de carga
    }
  };

  return (
    <div className="modal-rc">
      <div className="modal-content-rc" style={styles.modalContent}>
        <h2>Recuperar Contraseña</h2>
        {!emailSent && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label htmlFor="email" style={styles.label}>
              Ingrese el correo asociado a su cuenta:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            {email.trim().length > 0 && emailAvailable && (
              <p
                style={{
                  backgroundColor: "red",
                  color: "white",
                  margin: "5px 0",
                  fontSize: "14px",
                }}
              >
                ¡Este Email no se encuentra registrado!
              </p>
            )}
            {message && (
              <p
                style={{
                  backgroundColor: emailExists ? "green" : "red",
                  color: "white",
                  margin: "5px 0",
                  fontSize: "14px",
                }}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              style={{
                ...styles.button,
                backgroundColor: !validEmailFormat || emailAvailable ? "gray" : "#007BFF",
                cursor: !validEmailFormat || emailAvailable ? "not-allowed" : "pointer",
              }}
              className="btnEnviar-rc"
              disabled={!validEmailFormat || emailAvailable || sendingEmail} // Deshabilitar el botón cuando el email no es válido o se está enviando el correo
            >
              {sendingEmail ? "Enviando..." : "Enviar"}
            </button>
          </form>
        )}

        {showVerification && (
          <form onSubmit={handleVerificationSubmit} style={styles.form}>
            <label htmlFor="verificationCode" style={styles.label}>
              Ingrese el código de verificación:
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={handleVerificationChange}
              required
              style={styles.input}
            />
            {verificationError && (
              <p style={{ color: "red", margin: "5px 0" }}>
                {verificationError}
              </p>
            )}
            <label htmlFor="newPassword" style={styles.label}>
              Nueva contraseña:
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
              style={styles.input}
            />
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirmar nueva contraseña:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              style={styles.input}
            />
            {!passwordsMatch && (
              <p style={{ color: "red", margin: "5px 0" }}>
                Las contraseñas no coinciden.
              </p>
            )}
            {passwordError && (
              <p style={{ color: "red", margin: "5px 0" }}>{passwordError}</p>
            )}
            <button
              type="submit"
              style={{
                ...styles.button,
                backgroundColor: passwordsMatch && !passwordError ? "blue" : "gray",
                cursor: passwordsMatch && !passwordError ? "pointer" : "not-allowed",
              }}
              disabled={!passwordsMatch || passwordError || updatingPassword} // Deshabilitar el botón si las contraseñas no coinciden o hay un error
            >
              {updatingPassword ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        )}

        {message && !showVerification && (
          <p
            style={{
              backgroundColor: "green",
              color: "white",
              margin: "5px 0",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}

        <div className="btnContainerG">
          <button
            id="btnSalir"
            className="btnRegresoLogin"
            onClick={handleBackToLoginClick}
          >
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <div className="text">Return to Login</div>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
};

export default RecuperarContra;
