import React, { useState, useEffect } from "react";

const RecuperarContra = ({ handleBackToLoginClick }) => {
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Verificar la disponibilidad del email solo si contiene ".com"
    if (email.includes(".com")) {
      fetch("http://localhost:3000/checkEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Envía el email en el cuerpo de la solicitud
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
  }, [email]); // Este efecto se activará cada vez que el valor de "email" cambie

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailExists) {
      setMessage("¡Este Email no se encuentra registrado!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/emailController", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Código de recuperación enviado a ${email}`);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setMessage("Error al realizar la solicitud. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="modal" style={styles.modal}>
      <div className="modal-content" style={styles.modalContent}>
        <h2>Recuperar Contraseña</h2>
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
              backgroundColor: emailAvailable ? "gray" : "#007BFF",
              cursor: emailAvailable ? "not-allowed" : "pointer",
            }}
            disabled={emailAvailable}
          >
            Enviar
          </button>
        </form>
        <div className="btnContainerG">
          <button
            id="btnSalir"
            data-atropos-offset="20"
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

