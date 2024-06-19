import React, { useState, useEffect } from "react";
import axios from "axios";
import { decodificar } from "../Home/Home"; // Importa la función decodificar desde el componente Home
import "./Comentarios.css";
import { format } from "date-fns";
import { host } from "./Home";
import { Link } from "react-router-dom";

const Comentarios = ({ idPost, currentUser }) => {
  const [comentarios, setComentarios] = useState([]);
  const [newComentario, setNewComentario] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false); // Nuevo estado para verificar si el token ha expirado

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(
          `https://${host}/consultarComentarios?idPost=${idPost}`
        );
        setComentarios(response.data);
      } catch (error) {
        console.error("Error al cargar los comentarios:", error);
      }
    };

    const verifyToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = decodificar(token); // Usa la función decodificar
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
          } else {
            setTokenExpired(true); // Establece tokenExpired en true si el token ha expirado
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      }
    };

    fetchComentarios();
    verifyToken();
  }, [idPost]);

  const handleAddComentario = async () => {
    if (newComentario.trim() === "") return;
    const fechaHora = new Date();
    console.log(fechaHora);
    const año = fechaHora.getFullYear();
    const mes = (fechaHora.getMonth() + 1).toString().padStart(2, "0"); // Los meses van de 0 a 11, por lo que sumamos 1
    const dia = fechaHora.getDate().toString().padStart(2, "0");
    const horas = fechaHora.getHours().toString().padStart(2, "0");
    const minutos = fechaHora.getMinutes().toString().padStart(2, "0");
    const segundos = fechaHora.getSeconds().toString().padStart(2, "0");
    const fechaFormateada = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    try {
      await axios.post(`https://${host}/agregarComentario`, {
        idPost,
        contenido: newComentario,
        autor: currentUser,
        fecha: fechaFormateada,
      });
      setNewComentario("");
      const updatedComentarios = await axios.get(
        `https://${host}/consultarComentarios?idPost=${idPost}`
      );
      setComentarios(updatedComentarios.data);
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
    }
  };

  const handleDeleteComentario = async (idComentario) => {
    try {
      await axios.delete(
        `https://${host}/eliminarComentario?idComentario=${idComentario}`
      );
      const updatedComentarios = await axios.get(
        `https://${host}/consultarComentarios?idPost=${idPost}`
      );
      setComentarios(updatedComentarios.data);
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };
  const formatearTiempoTranscurrido = (fecha) => {
    const fechaPasada = new Date(fecha);
    const fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() - 5);

    if (fechaPasada > fechaActual) {
      return "Fecha futura";
    }

    const diferenciaEnMilisegundos = fechaActual - fechaPasada;
    const segundos = Math.floor(diferenciaEnMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (años > 0) {
      return `hace ${años === 1 ? "1 año" : `${años} años`}`;
    } else if (meses > 0) {
      return `hace ${meses === 1 ? "1 mes" : `${meses} meses`}`;
    } else if (dias > 0) {
      return `hace ${dias === 1 ? "1 día" : `${dias} días`}`;
    } else if (horas > 0) {
      return `hace ${horas === 1 ? "1 hora" : `${horas} horas`}`;
    } else if (minutos > 0) {
      return `hace ${minutos === 1 ? "1 minuto" : `${minutos} minutos`}`;
    } else {
      return `hace ${segundos === 1 ? "1 segundo" : `${segundos} segundos`}`;
    }
  };

  return (
    <div className="contenedor-comentarios">
      <h4 className="lato-bold-italic">COMENTARIOS</h4>
      {comentarios.map((comentario) => (
        <div key={comentario.idComentario} className="comentario">
          {currentUser === comentario.autor && !tokenExpired && (
            <button
              onClick={() => handleDeleteComentario(comentario.idComentario)}
              className="btn-eliminar-comentario"
            >
              Eliminar
            </button>
          )}
          <p
            className={`usuario-Comento ${currentUser === comentario.autor && !tokenExpired
                ? "usuario-con-boton"
                : ""
              }`}
          >
            <strong>
              <Link
                className="label-container"
                id='usuario-coment'
                to={`/postByUser/${comentario.autor}`}
              >
                @{comentario.autor}
              </Link> •{" "}
              {formatearTiempoTranscurrido(
                new Date(comentario.fechaComentario)
              )}
            </strong>
          </p>
          <p className="contenido-comentario lato-bold">{comentario.contenido}</p>
        </div>
      ))}
      {isAuthenticated && !tokenExpired ? (
        <div>
          <input
            type="text"
            className="text-new-comment"
            value={newComentario}
            onChange={(e) => setNewComentario(e.target.value)}
            placeholder="Escribe un comentario"
            maxLength={300}

          />
          <button className="btn-comentar" onClick={handleAddComentario}>
            Comentar
          </button>
        </div>
      ) : (
        <p className="mensajeNoSession lato-thin">
          {tokenExpired
            ? "Tu sesión ha expirado. Inicia sesión nuevamente para comentar"
            : "Inicia sesión para comentar"}
        </p>
      )}
    </div>
  );
};

export default Comentarios;
