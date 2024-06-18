import "./Home.css";

import React, { useEffect, useRef, useState } from "react";
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

export const host = "free.iblog.click";
const Home = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showForm1, setShowForm1] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showInterests, setShowInterests] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(""); // Estado para el nombre de la categoría actual
  const [categorias, setCategorias] = useState([]);

  const formatearTiempoTranscurrido = (fecha) => {
    const fechaPasada = new Date(fecha);
    const fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() - 5);
    if (fechaPasada > fechaActual) {
      return "Fecha futura";
    }
    // Imprimir el estado antes de ser enviado
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

  const handleMultipleCategoriesClick = async (categoriaId) => {
    try {
      const response = await axios.post(`https://${host}/consultaPostCat`, {
        categoriaId,
      });

      const results = response.data;
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
  const setCategoriasEnHome = (categoriasData) => {
    setCategorias(categoriasData); // Actualiza el estado de categorías en Home
  };
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
      const response = await axios.post(`https://${host}/consultaPostCat`, {
        categoriaId,
      });

      setPosts(response.data);
      clickCategorias();
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Opcional: animación suave
      });
    } catch (error) {
      console.error("Error al cargar los posts:", error);
    }
    const categoriaSeleccionada = categorias.find(
      (categoria) => categoria.id === categoriaId
    );

    if (categoriaId !== "*") {
      setCategoriaActual(categoriaSeleccionada.nombre); // Aquí deberías tener el nombre de la categoría, pero usa el ID por ahora
    } else {
      setCategoriaActual(""); // Reinicia el estado si la categoría es "*"
    }
  };

  const handleComentariosClick = (postId, currentUser) => {
    setSelectedPostId(postId);
    setCurrentUser(currentUser); // Agregar esta línea para establecer currentUser antes de mostrar los comentarios
  };
  const handleReload = () => {
    window.location.reload();
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addListener(handleResize);

    return () => mediaQuery.removeListener(handleResize);
  }, []);
  const [isCategorias, setIsCategorias] = useState(false);

  const clickCategorias = () => {
    setIsCategorias(!isCategorias);
  };

  return (
    <>
      <div className="contedorPrincipal">
        <div className="barra-navegacion-home">
          <div className="logo-container">
            <img
              className="logo-image"
              onClick={handleReload}
              style={{ cursor: "pointer" }}
            />
          </div>
          <BuscadorPosts setPosts={setPosts} />
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
          {isMobile && !showForm && !showForm1 && !showInterests ? (
            <div className={`overlay ${isCategorias ? "show" : ""}`}>
              <button
                onClick={clickCategorias}
                className={`btn-menu-categorias ${isCategorias ? "active" : ""
                  }`}
              >
                ➤
              </button>
              {isCategorias && (
                <div className="cont-categorias-des">
                  <h2>CATEGORIAS</h2>
                  <Categorias
                    onCategoriaClick={handleCategoriaClick}
                    setCategoriasEnHome={setCategoriasEnHome}
                  />
                  <div className="logo-Empresa">
                    <img
                      className="logo-empresa"
                      src="https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/logohd.png"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="contIzquierdo">
              <div className="contCategorias">
                <h2>CATEGORIAS</h2>
                <Categorias
                  onCategoriaClick={handleCategoriaClick}
                  setCategoriasEnHome={setCategoriasEnHome}
                />
              </div>
              <div className="logo-Empresa">
                <img
                  className="logo-empresa"
                  src="https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/logohd.png"
                />
              </div>
            </div>
          )}
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
            {showForm1 && <Formulario onClose={handleClick} />}
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.idPost} className="postP">
                  <div className="card-post">
                    <div className="headerPost">
                      <img
                        className="miniatura"
                        src={post.urlImagenPerfil}
                      />

                      <label className="label-container">
                        <Link
                          className="label-container"
                          to={`/postByUser/${post.dueño}`}
                        >
                          @{post.dueño}
                        </Link>
                        • {formatearTiempoTranscurrido(post.fechaPublicacion)}
                      </label>
                    </div>
                    {post.urlImagen && (
                      <div className="card-image-post">
                        <img
                          className="img-Post"
                          src={post.urlImagen}
                          alt="imagen del Post"
                        />
                      </div>
                    )}
                    <p className="card-title-post">{post.titulo}</p>
                    <p className="card-body-post">{post.contenido}</p>
                    <div className="contBtnPost">
                      <button
                        className="bookmarkBtn"
                        onClick={() =>
                          handleComentariosClick(post.idPost, currentUser)
                        }
                      >
                        <span className="IconContainer">
                          <svg
                            fill="black"
                            viewBox="0 0 512 512"
                            height="1.5em"
                          >
                            <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"></path>
                          </svg>
                        </span>
                      </button>
                      {post.urlDocumento && (
                        <a href={post.urlDocumento} className="Btn-descarga">
                          <svg
                            className="svgIcon-descarga"
                            viewBox="0 0 384 512"
                            height="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                          </svg>
                          <span className="icon2-descarga"></span>
                          <span className="tooltip-descarga">download</span>
                        </a>
                      )}
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
              <p className="mensajePostsVaciosL">
                NO HAY POSTS EN ESTA CATEGORIA
              </p>
            )}
          </div>
          <div className="contDerecho">
            <UserCard />
            <div className="categoriaAct">
              <h3>
                {" "}
                {categoriaActual ? `Estás Viendo: ${categoriaActual}` : ""}
              </h3>
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
      </div >
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
