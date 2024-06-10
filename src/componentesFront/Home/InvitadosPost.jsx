import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Comentarios from "./Comentarios.jsx"; // Importa el componente Comentarios desde Comentarios.jsx
import { host } from './Home';

const InvitadoPosts = () => {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentUser, setCurrentUser] = useState("usuarioActual"); // Ajusta según tu lógica

  const loadPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://${host}:3000/consultarpostsall?limit=10&offset=${offset}`
      );
      if (response.data.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
        setOffset((prevOffset) => prevOffset + 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error al cargar los posts:", error);
      setHasMore(false); // En caso de error, asumimos que no hay más posts
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []); // Cargar posts al inicializar el componente

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        loadPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  const formatearFecha = (fecha) => {
    const fechaISO = parseISO(fecha);
    const diferenciaEnAños = new Date().getFullYear() - fechaISO.getFullYear();
    if (diferenciaEnAños < 1) {
      return formatDistanceToNow(fechaISO, { locale: es });
    } else {
      return format(fechaISO, "MMMM yyyy", { locale: es });
    }
  };

  const handleComentariosClick = (idPost, currentUser) => {
    setSelectedPostId(idPost);
    // Aquí puedes agregar lógica adicional para cargar comentarios si es necesario
  };

  return (
    <div className="invitado-posts">
      {posts.map((post) => (
        <div key={post.idPost} className="postP">
          <div className="card">
            <div className="headerPost">
              <img
                src={"src/componentesFront/Login/images/iconoMichael.png"}
                alt="Miniatura"
                style={{ width: "50px", height: "50px" }}
              />
              <label>
                {post.dueño} • {formatearFecha(post.fechaPublicacion)}
              </label>
            </div>
            <div className="card-image">
              <img src="src/componentesFront/Login/images/logoApp1.png" />
            </div>
            <p className="card-title">{post.titulo}</p>
            <p className="card-body">{post.contenido}</p>
            <div className="contBtnPost">
              <button
                className="btnComentarios"
                onClick={() => handleComentariosClick(post.idPost, currentUser)}
              >
                Comentarios..
              </button>
            </div>
            {selectedPostId === post.idPost && (
              <Comentarios
                idPost={post.idPost}
                currentUser={currentUser}
                onClose={() => setSelectedPostId(null)}
              />
            )}
          </div>
        </div>
      ))}
      {loading && <p>Cargando más posts...</p>}
      {!hasMore && !loading && <p>No hay más posts disponibles.</p>}
    </div>
  );
};

export default InvitadoPosts;
