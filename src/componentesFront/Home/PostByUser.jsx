import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { host } from './Home';

const PostByUser = () => {
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://${host}/consultarUser?username=${username}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`https://${host}/consultarPostUsername?username=${username}`);
        setUserPosts(response.data);
      } catch (error) {
        console.error('Error al obtener los posts del usuario:', error);
      }
    };

    fetchUserInfo();
    fetchUserPosts();
  }, [username]);

  if (!userInfo) {
    return <p>Cargando información del usuario... {username}</p>;
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
