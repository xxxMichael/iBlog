import React, { useEffect, useState } from "react";
import { parseJwt } from "../Main/Main";
import { Link } from "react-router-dom";
import { FaSearch, FaHome, FaUser } from "react-icons/fa";
import Categorias from "./Categorias.jsx";
import axios from "axios";
import LoginForm from "../Login/Login.jsx";
import Formulario from "./formularioPost.jsx";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Comentarios from "./Comentarios.jsx"; // Importa el componente Comentarios desde Comentarios.jsx

export function decodificar(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}


const Home = () => {
  
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showForm1, setShowForm1] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Definir el estado currentUser y su función setter setCurrentUser

  const formatearFecha = (fecha) => {
    const fechaISO = parseISO(fecha);
    const diferenciaEnAños = new Date().getFullYear() - fechaISO.getFullYear();
    if (diferenciaEnAños < 1) {
      return formatDistanceToNow(fechaISO, { locale: es });
    } else {
      return format(fechaISO, "MMMM yyyy", { locale: es });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      setUserData(decodedToken);
      setCurrentUser(decodedToken.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const token = localStorage.getItem("token");
  const tokenExistAndStillValid =
    token && parseJwt(token).exp * 1000 > Date.now();

  let buttonText = tokenExistAndStillValid ? "Crear Posts" : "Iniciar Sesion";
  let direct = tokenExistAndStillValid ? "#" : "/login";

  const handleClick = (event) => {
    if (userData != null) {
      setShowForm1(!showForm1);
      setSearchDisabled(!showForm1);
    } else {
      setShowForm(!showForm);
      setSearchDisabled(!showForm);
    }
  };

  const handleClick1 = (event) => {
    setShowForm1(!showForm1);
    setSearchDisabled(!showForm1);
  };

  const estilos = () => {
    if (userData != null) {
      return {
        opacity: !showForm1 ? 1 : 0,
        pointerEvents: !showForm1 ? "auto" : "none",
      };
    } else {
      return {
        opacity: !showForm ? 1 : 0,
        pointerEvents: !showForm ? "auto" : "none",
      };
    }
  };

  const handleCategoriaClick = async (categoriaId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/consultaPostCat?categoriaId=${categoriaId}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error al cargar los posts:", error);
    }
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleComentariosClick = (postId, currentUser) => {
    setSelectedPostId(postId);
    setCurrentUser(currentUser); // Agregar esta línea para establecer currentUser antes de mostrar los comentarios
  };
  return (
    <>
      <div className="contedorPrincipal">
        <div className="barra-navegacion">
          <div className="logo-container">
            <img
              src="src/componentesFront/Login/images/logoApp1.png"
              alt="Logo"
            />
          </div>
          <div className="buscador">
            <input
              className="inputB"
              disabled={searchDisabled}
              type="text"
              placeholder="Search"
            />
            <FaSearch className="iconoBuscar" />
          </div>
          <Link
            className="btnInicioSesion"
            id="btnP"
            onClick={handleClick}
            style={estilos()}
          >
            {buttonText}
          </Link>
        </div>
        <div className="cont">
          <div className="contIzquierdo">
            <div className="contNav">
              <Link className="btnNav" to="/">
                <FaHome size={25} className="icon" /> Home
              </Link>
              <Link className="btnNav" to="/perfil">
                <FaUser size={25} className="icon" /> Perfil
              </Link>
            </div>
            <div className="contCategorias">
              <strong>Categorias</strong>
              <Categorias onCategoriaClick={handleCategoriaClick} />
            </div>
            <button className="btnCerrarSesion" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
          <div className="contCentral">
            <div className="contenedorPer">
              <button> Perfil </button>
              <p> Contenido del Perfil </p>
            </div>
            {showForm1 && <Formulario onClose={handleClick1} />}
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.idPost} className="postP">
                  <div className="card">
                    <div className="headerPost">
                      <img
                        src={
                          "src/componentesFront/Login/images/iconoMichael.png"
                        }
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
              ))
            ) : (
              <p className="mensajePostsVacios">No hay posts disponibles.</p>
            )}
          </div>
          <div className="contDerecho">
            <div className="contenidoD">
              <div className="contenedorCube"></div>
            </div>
          </div>
        </div>
        {showForm && (
          <div
            className="loginOverlay"
            onClick={(e) => {
              if (e.target.className === "loginOverlay") {
                handleClick();
              }
            }}
          >
            <div className="loginFormWrapper">
              <LoginForm onClose={handleClick} />
            
            </div>
          </div>
        )}
      </div>
      <style>{`
        .cerrar-formulario {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background-color: red;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
        }
        .loginFormWrapper {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .loginOverlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .comentarios {
          background-color: #f9f9f9;
          padding: 10px;
          border: 1px solid #ddd;
          margin-top: 10px;
        }
        .comentario {
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
};

export default Home;
