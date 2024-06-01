import React, { useState, useEffect } from "react";
import axios from "axios";

const Comentarios = ({ idPost, currentUser }) => {
  const [comentarios, setComentarios] = useState([]);
  const [newComentario, setNewComentario] = useState("");

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/consultarComentarios?idPost=${idPost}`
        );
        setComentarios(response.data);
      } catch (error) {
        console.error("Error al cargar los comentarios:", error);
      }
    };
    fetchComentarios();
  }, [idPost]);

  const handleAddComentario = async () => {
    if (newComentario.trim() === "") return;

    try {
      await axios.post("http://localhost:3000/agregarComentario", {
        idPost,
        contenido: newComentario,
        autor: currentUser
      });
      setNewComentario("");
      const updatedComentarios = await axios.get(
        `http://localhost:3000/consultaComentarios?idPost=${idPost}`
      );
      setComentarios(updatedComentarios.data);
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
    }
  };

  const handleDeleteComentario = async (idComentario) => {
    try {
      await axios.delete(`http://localhost:3000/eliminarComentario?idComentario=${idComentario}`);
      const updatedComentarios = await axios.get(
        `http://localhost:3000/consultaComentarios?idPost=${idPost}`
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
          <p><strong>{comentario.autor}</strong></p>
          {currentUser === comentario.autor && (
            <button onClick={() => handleDeleteComentario(comentario.idComentario)}>Eliminar</button>
          )}
        </div>
      ))}
      <div>
        <input
          type="text"
          value={newComentario}
          onChange={(e) => setNewComentario(e.target.value)}
          placeholder="Escribe un comentario"
        />
        <button onClick={handleAddComentario}>Comentar</button>
      </div>
    </div>
  );
};

export default Comentarios;
