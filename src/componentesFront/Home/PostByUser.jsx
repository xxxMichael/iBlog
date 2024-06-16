import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { host } from "./Home";

const PostByUser = () => {
  const { username } = useParams(); // Obtener el parámetro 'username' de la URL
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // Información del usuario

  useEffect(() => {
    // Función para obtener información del usuario
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://${host}/consultarUser?username=${username}`);
        setUserInfo(response.data); // Actualizar el estado con la información del usuario
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

    // Función para obtener los posts del usuario
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`https://${host}/consultarPostUsername?username=${username}`);
        setUserPosts(response.data); // Actualizar el estado con los posts del usuario
      } catch (error) {
        console.error('Error al obtener los posts del usuario:', error);
      }
    };

    fetchUserInfo(); // Llamar a la función para obtener la información del usuario
    fetchUserPosts(); // Llamar a la función para obtener los posts del usuario
  }, [username]); // Ejecutar el efecto cada vez que cambie 'username'

  if (!userInfo) {
    return <p>Cargando información del usuario...</p>; // Mensaje de carga mientras se obtiene la información del usuario
  }

  return (
    <div>
      <h2>Posts de {userInfo.nombre}</h2>
      <ul>
        {userPosts.map((post) => (
          <li key={post.id}>
            <p>{post.titulo}</p>
            <p>{post.contenido}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostByUser;
