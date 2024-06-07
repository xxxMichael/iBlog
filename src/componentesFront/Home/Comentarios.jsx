import React, { useState, useEffect } from "react";
import axios from "axios";
import { decodificar } from "../Home/Home"; // Importa la función decodificar desde el componente Home
import './Comentarios.css';
import { format } from 'date-fns';

const Comentarios = ({ idPost, currentUser }) => {
  const [comentarios, setComentarios] = useState([]);
  const [newComentario, setNewComentario] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false); // Nuevo estado para verificar si el token ha expirado

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(
          `http://52.67.196.92:3000/consultarComentarios?idPost=${idPost}`
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

    try {
      await axios.post("http://52.67.196.92:3000/agregarComentario", {
        idPost,
        contenido: newComentario,
        autor: currentUser,
      });
      setNewComentario("");
      const updatedComentarios = await axios.get(
        `http://52.67.196.92:3000/consultarComentarios?idPost=${idPost}`
      );
      setComentarios(updatedComentarios.data);
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
    }
  };

  const handleDeleteComentario = async (idComentario) => {
    try {
      await axios.delete(
        `http://52.67.196.92:3000/eliminarComentario?idComentario=${idComentario}`
      );
      const updatedComentarios = await axios.get(
        `http://52.67.196.92:3000/consultarComentarios?idPost=${idPost}`
      );
      setComentarios(updatedComentarios.data);
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };

  return (
    <div className="comentarios">
      <h4>Comentarios</h4>
      {comentarios.map((comentario) => (
        <div key={comentario.idComentario} className="comentario">
          <p>{comentario.contenido}</p>
          <p>
            <strong>{comentario.autor}</strong>
          </p>
          <p>
          {format(new Date(comentario.fechaComentario), 'yyyy-MM-dd HH:mm:ss')}
          </p>
          {currentUser === comentario.autor && !tokenExpired && (
            <button
              onClick={() => handleDeleteComentario(comentario.idComentario)}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      {isAuthenticated && !tokenExpired ? (
        <div>
          <input
            type="text"
            value={newComentario}
            onChange={(e) => setNewComentario(e.target.value)}
            placeholder="Escribe un comentario"
          />
          <button onClick={handleAddComentario}>Comentar</button>
        </div>
      ) : (
        <p>
          {tokenExpired
            ? "Tu sesión ha expirado. Inicia sesión nuevamente para comentar"
            : "Inicia sesión para comentar"}
        </p>
      )}
    </div>
  );
};

export default Comentarios;
