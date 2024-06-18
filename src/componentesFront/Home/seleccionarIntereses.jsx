import React, { useEffect, useState } from "react";
import { host } from "./Home";
import "./seleccionarIntereses.css";
import { decodificar } from "../Home/Home";

const SeleccionarIntereses = ({ onHide }) => {
  const [categorias, setCategorias] = useState([]);
  const [selectedIntereses, setSelectedIntereses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`https://${host}/consultarCatego`);
        if (!response.ok) {
          throw new Error("Error al consultar categorías");
        }
        const data = await response.json();
        setCategorias(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    const value = parseInt(e.target.value);
    if (checked) {
      setSelectedIntereses([...selectedIntereses, value]);
    } else {
      setSelectedIntereses(selectedIntereses.filter((item) => item !== value));
    }
  };

  const guardarIntereses = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in the cache");
      return;
    }

    try {
      const decodedToken = await decodificar(token);
      const username = decodedToken.username;

      if (!username) {
        console.error("Username not found in the decoded token");
        return;
      }

      const response = await fetch(`https://${host}/guardarIntereses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categorias: selectedIntereses,
          username: username,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar intereses");
      }

      const result = await response.json();
      console.log("Intereses guardados exitosamente:", result);

      const infUserResponse = await fetch(`https://${host}/infUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });

      if (!infUserResponse.ok) {
        throw new Error("Error al obtener el token");
      }

      const tokenData = await infUserResponse.json();
      localStorage.setItem("token", tokenData.token);
      console.log("Token guardado correctamente:", tokenData.token);

      setExito(true);
      setTimeout(() => {
        onHide();
      }, 1000);
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
    }
  };

  const handleGuardarClick = (e) => {
    e.preventDefault();
    if (selectedIntereses.length === 3) {
      guardarIntereses();
    }
  };

  if (exito) {
    return <p style={{color:'white' }}>¡Gracias por seleccionar sus intereses!</p>;
  }

  return (
    <div className="seleccionar-intereses">
      <form>
        <h2>Seleccione sus Intereses</h2>

        <div className="organizador">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="checkbox-container">
              <input
                className="tgl tgl-flip"
                type="checkbox"
                id={`categoria-${categoria.id}`}
                value={categoria.id}
                name="categorias"
                onChange={handleCheckboxChange}
              />
              <label
                className="tgl-btn"
                data-tg-off={categoria.nombre}
                data-tg-on={categoria.nombre}
                htmlFor={`categoria-${categoria.id}`}
              ></label>
              {/*  <span>{categoria.nombre}</span>*/}
            </div>
          ))}
        </div>
        <button
          onClick={handleGuardarClick}
          disabled={selectedIntereses.length !== 3}
        >
          Guardar intereses
        </button>
      </form>
    </div>
  );
};

export default SeleccionarIntereses;
