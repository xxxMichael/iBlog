import React, { useEffect, useState } from "react";
import { parseJwt } from "../Main/Main";
import { Link } from "react-router-dom";
import { FaSearch, FaHome, FaUser } from "react-icons/fa";
import Categorias from "./Categorias.jsx";
import axios from "axios";
import LoginForm from "../Login/Login.jsx"; // Importa el componente LoginForm

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
  const [searchDisabled, setSearchDisabled] = useState(false);
  let buttonText = "";
  let direct = null;

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
    setShowForm(!showForm); // Cambia el estado para mostrar u ocultar el formulario de inicio de sesión
    setSearchDisabled(!showForm);
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
            style={{
              opacity: !showForm ? 1 : 0,
              pointerEvents: !showForm ? "auto" : "none",
            }}
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
          </div>
          <div className="contCentral">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.idPost} className="post">
                  <h3>{post.titulo}</h3>
                  <p>{post.contenido}</p>
                  <p>
                    <strong>Dueño:</strong> {post.dueño}
                  </p>
                  <p>
                    <strong>Fecha de Publicación:</strong>{" "}
                    {new Date(post.fechaPublicacion).toLocaleDateString()}
                  </p>
                  {post.urlImagen && (
                    <img src={post.urlImagen} alt="Imagen del post" />
                  )}
                  {post.urlDocumento && (
                    <a
                      href={post.urlDocumento}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Documento
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p>No hay posts disponibles.</p>
            )}
          </div>
          <div className="contDerecho">
            <div className="contenidoD">
              <div className="tituloDerecho"> DESARROLLADORES: </div>
              <div className="contenedorImagen">
                <img
                  src={"src/componentesFront/Login/images/iconoMichael.png"}
                  alt="Miniatura"
                  style={{ width: "50px", height: "50px" }}
                />
                <label>Michael Chavez</label>
              </div>
              <div className="contenedorImagen">
                <img
                  src={"src/componentesFront/Login/images/perfilD.jpg"}
                  alt="Miniatura"
                  style={{ width: "50px", height: "50px" }}
                />
                <label>David Giler</label>
              </div>
              <div className="contenedorImagen">
                <img
                  src={""}
                  alt="Miniatura"
                  style={{ width: "50px", height: "50px" }}
                />
                <label>Kevin Peñafiel</label>
              </div>
              <button onClick={handleLogout}>Cerrar Sesión</button>
              <label>
                Información del JWT:
                {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
              </label>
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
      </div>
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