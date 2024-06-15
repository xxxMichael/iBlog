import React, { useEffect, useState } from "react";
import { host } from "./Home";
import "./seleccionarIntereses.css";

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

  const handleGuardarClick = () => {
    console.log(categorias);
    console.log(selectedIntereses);

    if (selectedIntereses.length === 3) {
      // Realizar la solicitud POST
      fetch(`https://${host}/guardarIntereses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categorias: selectedIntereses }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al guardar intereses");
          }
          return response.json();
        })
        .then((data) => {
          setExito(true); // Indicar que la inserción fue exitosa
          setTimeout(() => {
            onHide(); // Ocultar el componente después de 2 segundos
          }, 1000);
        })
        .catch((error) => {
          console.error("Error al guardar intereses:", error.message);
        });
    } else {
      alert("Debes seleccionar exactamente 3 intereses.");
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
