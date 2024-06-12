import './Home.css';

import React, { useEffect, useState } from "react";
import { parseJwt } from "../Main/Main";
import { Link } from "react-router-dom";
import { FaSearch, FaHome, FaUser } from "react-icons/fa";
import Categorias from "./categorias.jsx";
import axios from "axios";
import LoginForm from "../Login/Login.jsx";
import Formulario from "./formularioPost.jsx";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Comentarios from "./Comentarios.jsx"; // Importa el componente Comentarios desde Comentarios.jsx
import UserCard from "./usercard.jsx";
import SeleccionarIntereses from "./seleccionarIntereses.jsx"; // Asegúrate de importar el componente
import InvitadoPosts from "./InvitadosPost.jsx"; // Importa el componente
import BuscadorPosts from "./BuscadorPosts.jsx";
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

export const host = "localhost";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showForm1, setShowForm1] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Definir el estado currentUser y su función setter setCurrentUser
  const [showInterests, setShowInterests] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const formatearTiempoTranscurrido = (fecha) => {
    const fechaPasada = new Date(fecha);
    const fechaActual = new Date();

    if (fechaPasada > fechaActual) {
      return 'Fecha futura';
    }

    const diferenciaEnMilisegundos = fechaActual - fechaPasada;
    const segundos = Math.floor(diferenciaEnMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (años > 0) {
      return `hace ${años === 1 ? '1 año' : `${años} años`}`;
    } else if (meses > 0) {
      return `hace ${meses === 1 ? '1 mes' : `${meses} meses`}`;
    } else if (dias > 0) {
      return `hace ${dias === 1 ? '1 día' : `${dias} días`}`;
    } else if (horas > 0) {
      return `hace ${horas === 1 ? '1 hora' : `${horas} horas`}`;
    } else if (minutos > 0) {
      return `hace ${minutos === 1 ? '1 minuto' : `${minutos} minutos`}`;
    } else {
      return `hace ${segundos === 1 ? '1 segundo' : `${segundos} segundos`}`;
    }
  };



  const handleMultipleCategoriesClick = async (categoriaIds) => {
    try {
      const promises = categoriaIds.map(async (categoriaId) => {
        const response = await axios.get(
          `http://${host}:3000/consultaPostCat?categoriaId=${categoriaId}`
        );
        return response.data;
      });

      const results = await Promise.all(promises);
      const mergedPosts = results.flat(); // Mezcla los posts recibidos en una sola matriz

      // Filtrar y excluir los posts duplicados
      const uniquePosts = [];
      const postIds = new Set();

      mergedPosts.forEach((post) => {
        if (!postIds.has(post.idPost)) {
          uniquePosts.push(post);
          postIds.add(post.idPost);
        }
      });

      setPosts(uniquePosts);
    } catch (error) {
      console.error("Error al cargar los posts:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkTokenValidity = () => {
      if (token) {
        const decodedToken = decodificar(token);
        const currentTime = Date.now() / 1000; // Obtiene el tiempo actual en segundos
        if (decodedToken.exp < currentTime) {
          // El token ha expirado
          alert("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
          window.location.reload();
          localStorage.removeItem("token");
        } else {
          // Verificar si el token tiene categorías
          if (
            decodedToken.categoria1 &&
            decodedToken.categoria2 &&
            decodedToken.categoria3
          ) {
            setUserData(decodedToken);
            handleMultipleCategoriesClick([
              decodedToken.categoria1,
              decodedToken.categoria2,
              decodedToken.categoria3,
            ]);
          } else {
            handleCategoriaClick("*");

            setShowInterests(true);
          }
          setUserData(decodedToken);
          setCurrentUser(decodedToken.username);
        }
      } else {
        handleCategoriaClick("*");
      }
    };

    checkTokenValidity();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const token = localStorage.getItem("token");
  const tokenExistAndStillValid =
    token && parseJwt(token).exp * 1000 > Date.now();

  let buttonText = tokenExistAndStillValid ? "Crear Posts" : "Iniciar Sesion";

  const handleClick = (event) => {
    if (userData != null) {
      setShowForm1(!showForm1);
      setSearchDisabled(!showForm1);
    } else {
      setShowForm(!showForm);
      setSearchDisabled(!showForm);
    }
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
        `http://${host}:3000/consultaPostCat?categoriaId=${categoriaId}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error al cargar los posts:", error);
    }
  };

  const handleComentariosClick = (postId, currentUser) => {
    setSelectedPostId(postId);
    setCurrentUser(currentUser); // Agregar esta línea para establecer currentUser antes de mostrar los comentarios
  };
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="contedorPrincipal">
        <div className="barra-navegacion">
          <div className="logo-container">
            {/*  <Link className="btnNav" to="/">*/}
            <img
              className="logo-image"
              onClick={handleReload}
              style={{ cursor: "pointer" }}
            />

            {/* </Link>*/}
          </div>
          <BuscadorPosts setPosts={setPosts} />

          {/*   <div className="buscador">
            <input
              className="inputB"
              disabled={searchDisabled}
              type="text"
              placeholder="Search"
            />
            <FaSearch className="iconoBuscar" />
          </div>
          */}
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
            <div className="contNav"></div>
            <div className="contCategorias">
              <h2>Categorias</h2>
              <Categorias onCategoriaClick={handleCategoriaClick} />
            </div>
          </div>
          <div className="contCentral">
            {showInterests && (
              <div
                className="interestsOverlay"
                onClick={(e) => {
                  if (e.target.className === "interestsOverlay") {
                    setShowInterests(false);
                  }
                }}
              >
                <div className="interestsFormWrapper">
                  <SeleccionarIntereses
                    onHide={() => setShowInterests(false)}
                  />
                </div>
              </div>
            )}
            {showForm1 && (
              <Formulario onClose={handleClick} />
            )}
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.idPost} className="postP">
                  <div className="card">
                    <div className="headerPost">
                      <img className="miniatura" src='src/componentesFront/Home/images/bronce.gif'/>
                      <label>
                        {post.dueño} • {formatearTiempoTranscurrido(post.fechaPublicacion)}
                      </label>
                    </div>
                    <div className="card-image">
                      <img className="img-Post" src={post.urlImagen} alt="imagen del Post" />
                    </div>
                    <p className="card-title">{post.titulo}</p>
                    <p className="card-body">{post.contenido}</p>
                    <div className="contBtnPost">
                      <button
                        className="btnComentarios"
                        onClick={() =>
                          handleComentariosClick(post.idPost, currentUser)
                        }
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
            <UserCard />
            <div className="contenidoD"></div>
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
           .interestsFormWrapper {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          background-color="transparent";
        }
        .interestsOverlay {
        
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
