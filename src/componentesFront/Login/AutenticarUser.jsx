import React, { useState } from "react";

const AutenticarUser = () => {
  const [codigo, setCodigo] = useState("");

  const handleChange = (event) => {
    setCodigo(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(codigo);
    try {
      const response = await fetch("http://localhost:3000/verificarUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo }), // Enviar el código como JSON
      });
      console.log(response.ok);
      if (response.ok) {
        setTimeout(() => {
          alert("Autenticación exitosa. Por favor, inicie sesión.");
          window.location.reload(); 
        }, 3000);
      } else {
        alert("Autenticación fallida"); 
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Autenticación de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <h2>
            Se ha enviado un código de confirmación al correo ingresado, <br />
            por favor revisa el apartado de spam <br />
            si no se encuentra en el buzón principal e ingrésalo.
          </h2>
          <label htmlFor="codigo">Ingrese el código de verificación:</label>
          <input
            type="text"
            id="codigo"
            value={codigo}
            onChange={handleChange}
            required
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default AutenticarUser;
