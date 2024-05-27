import React, { useEffect, useState } from "react";
import { parseJwt } from "../Main/Main";
import { Link } from "react-router-dom";
import { FaSearch, FaHome, FaUser } from "react-icons/fa";
import Categorias from "./Categorias.jsx";
import axios from "axios";
import LoginForm from "../Login/Login.jsx"; // Importa el componente LoginForm
import Formulario from "./formularioPost.jsx";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formateo en español

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
  const [showForm, setShowForm] = useState(false); // Estado para mostrar u ocultar el formulario de inicio de sesión
  const [showForm1, setShowForm1] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);
  let buttonText = "";
  let direct = null;
  const formatearFecha = (fecha) => {
    const fechaISO = parseISO(fecha);
    const diferenciaEnAños = new Date().getFullYear() - fechaISO.getFullYear();
    console.log(diferenciaEnAños);
    if (diferenciaEnAños < 1) {
      return formatDistanceToNow(fechaISO, { locale: es });
    } else {
      return format(fechaISO, 'MMMM yyyy', { locale: es });
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      setUserData(decodedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const token = localStorage.getItem("token");
  const tokenExistAndStillValid =
    token && parseJwt(token).exp * 1000 > Date.now();

  if (tokenExistAndStillValid) {
    buttonText = "Crear Posts";
    direct = "#";
  } else {
    buttonText = "Iniciar Sesion";
    direct = "/login";
  }

  const handleClick = (event) => {
    if (userData != null) {
      setShowForm1(!showForm1); // Cambia el estado para mostrar u ocultar el formulario de inicio de sesión
      setSearchDisabled(!showForm1);
    } else {
      setShowForm(!showForm); // Cambia el estado para mostrar u ocultar el formulario de inicio de sesión
      setSearchDisabled(!showForm);
    }
  };
  const handleClick1 = (event) => {
    setShowForm1(!showForm1); // Cambia el estado para mostrar u ocultar el formulario de inicio de sesión
    setSearchDisabled(!showForm1);
  };
  const estilos = () => {
    if (userData != null) {
      return {
        opacity: !showForm1 ? 1 : 0,
        pointerEvents: !showForm1 ? "auto" : "none"
      };
    } else {
      return {
        opacity: !showForm ? 1 : 0,
        pointerEvents: !showForm ? "auto" : "none"
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
            //   to={direct}
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
              <button id="botonPrincipal">Categorias</button>
              <Categorias onCategoriaClick={handleCategoriaClick} />
            </div>
            <button className='btnCerrarSesion' onClick={handleLogout}>Cerrar Sesión</button>
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
                        src={"src/componentesFront/Login/images/iconoMichael.png"}
                        alt="Miniatura"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <label>{post.dueño} • {formatearFecha(post.fechaPublicacion)}</label>
                    </div>
                    <div className="card-image">
                      <img src="src/componentesFront/Login/images/logoApp1.png" />
                    </div>
                    <p className="card-title">{post.titulo}</p>
                    <p className="card-body">
                      {post.contenido}
                    </p>
                    <p>
                    </p>
                    <div className="contBtnPost">
                      <button className="btnComentarios">Comentarios...</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="mensajePostsVacios">No hay posts disponibles.</p>
            )}
          </div>
          <div className="contDerecho">
            <div className="contenidoD">
              <div className="contenedorCube">

              </div>
            </div>
          </div>
        </div>
        {showForm && (
          <div className="loginOverlay">
            <div className="loginFormWrapper">
              <LoginForm onClose={handleClick} />
              <button
                onClick={handleClick}
                className="cerrar-formulario"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div >
      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default Home;