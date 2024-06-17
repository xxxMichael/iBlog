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
  const actToken = () => {};
  async function guardarIntereses() {
    // Recuperar el token desde la caché del navegador
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in the cache");
      return;
    }

    try {
      // Decodificar el token para extraer el username
      const decodedToken = await decodificar(token);
      const username = decodedToken.username;

      if (!username) {
        console.error("Username not found in the decoded token");
        return;
      }

      // Realizar la solicitud para guardar intereses
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
      fetch(`https://${host}/infUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener el token");
          }
          return response.json();
        })
        .then((tokenData) => {
          localStorage.setItem("token", tokenData.token);
          console.log("Token guardado correctamente:", tokenData.token);
        })
        .catch((error) => {
          console.error("Error al obtener el token:", error.message);
        });
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
    }

    const data = await response.json();
    console.log("Intereses guardados exitosamente:", data);

    setExito(true);
    setTimeout(() => {
      onHide(); // Ocultar el componente después de 2 segundos
    }, 1000);

    // Si se guardaron correctamente los intereses, hacer fetch a infUser para obtener el token
  }

  const handleGuardarClick = () => {
    if (selectedIntereses.length === 3) {
      guardarIntereses();
    }
  };

  if (exito) {
    return <p>¡Gracias por seleccionar sus intereses!</p>;
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
