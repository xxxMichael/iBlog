import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { host } from "./Home";
import { decodificar } from "../Home/Home"; // Importa la función decodificar desde el componente Home
import Comentarios from "./Comentarios.jsx"; // Importa el componente Comentarios desde Comentarios.jsx
import { Link } from "react-router-dom";
import Flag from "react-world-flags";

import "./Home.css";

const PostByUser = () => {
  const { username } = useParams(); // Obtener el parámetro 'username' de la URL
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Definir
  const [posts, setPosts] = useState([]);
  const [paisCodigo, setPaisCodigo] = useState(""); // Estado para almacenar el código del país

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
  const handleComentariosClick = (postId, currentUser) => {
    setSelectedPostId(postId);
    setCurrentUser(currentUser); // Agregar esta línea para establecer currentUser antes de mostrar los comentarios
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      decodificar(token);
      const username = token.username;
    }
    // Función para obtener información del usuario
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `https://${host}/consultarUser?username=${username}`
        );
        if (response.data.pais) {
          // Extraer las dos últimas letras del país
          const codigoPais = response.data.pais.slice(-2).toUpperCase();
          setPaisCodigo(codigoPais); // Actualizar el estado de paisCodigo
        }
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };
    console.log(paisCodigo);

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `https://${host}/consultarPostUsername?username=${username}`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error al obtener los posts del usuario:", error);
      }
    };

    fetchUserInfo();
    fetchUserPosts();
  }, [username]);

  if (!userInfo) {
    return <p>Cargando información del usuario...</p>;
  }

  const navegarPrincipio = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Opcional: animación suave
    });
  }
  return (
    <div>
      {!userInfo ? (
        <p>Cargando información del usuario...</p>
      ) : (
        <div>
          <Link className="label-container-Home" to={"/"}>Regresar a Home</Link>
          <h2
            style={{ color: "white", textAlign: "center", lineHeight: "1.5" }}
          >
            Posts de {userInfo.nombre} {userInfo.apellido}
            <br />
            <span style={{ fontSize: "0.8em" }}>
              Rango: {userInfo.rol}
              <br />
              País: {userInfo.pais}
              <Flag code={paisCodigo} height="30" />
            </span>
          </h2>

          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.idPost} className="postP-User">
                <div className="card-post">
                  <div className="headerPost-User">
                    <img
                      className="miniatura"
                      src="https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/logoApp1.png"
                      alt="Miniatura"
                    />
                    <label className="label-container">
                      @{post.dueño}•{" "}
                      {formatearTiempoTranscurrido(post.fechaPublicacion)}
                    </label>
                  </div>
                  {post.urlImagen && (
                    <div className="card-image-post-User">
                      <img
                        className="img-Post"
                        src={post.urlImagen}
                        alt="Imagen del Post"
                      />
                    </div>
                  )}
                  <p className="card-title-post-User">{post.titulo}</p>
                  <p className="card-body-post-User">{post.contenido}</p>
                  <div className="contBtnPost-User">
                    <button
                      className="bookmarkBtn"
                      onClick={() =>
                        handleComentariosClick(post.idPost, currentUser)
                      }
                    >
                      <span className="IconContainer">
                        <svg fill="black" viewBox="0 0 512 512" height="1.5em">
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
            <p className="mensajePostsVaciosL">ESTE USUARIO NO TIENE POSTS</p>
          )}
          <button onClick={navegarPrincipio} className="btn-regresar-Principio">
            Regresar al Principio
          </button>
        </div>
      )}
    </div>
  );
};
export default PostByUser;
