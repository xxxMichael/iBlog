import React, { useEffect, useState } from 'react';
import { decodificar } from './Home';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './UserCard.css';

const UserCard = () => {
  const [userInfo, setUserInfo] = useState({ username: 'invitado', rol: 'invitado' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodificar(token);
      console.log('Decoded token:', decoded);
      if (decoded) {
        setUserInfo({ username: decoded.username || 'invitado', rol: decoded.rol || 'invitado' });
      }
    }
  }, []);

  const getRoleImage = (rol) => {
    if (!rol) return 'src/componentesFront/Home/img/invitado.gif';
    switch (rol.toLowerCase()) {
      case 'bronce':
        return 'src/componentesFront/Home/img/bronce.gif';
      case 'plata':
        return 'src/componentesFront/Home/img/plata.gif';
      case 'oro':
        return 'src/componentesFront/Home/img/oro.gif';
      default:
        return 'src/componentesFront/Home/img/invitado.gif';
    }
  };

  return (
    <div className="card" style={{ width: '18rem' }}>
      <img src={getRoleImage(userInfo.rol)} className="card-img-top" alt={`${userInfo.rol} badge`} />
      <div className="card-body">
        <h5 className="card-title">@{userInfo.username}</h5>
        <p className="card-text">Rol: {userInfo.rol}</p>
        <a href="#" className="btn btn-primary">Go to Profile</a>
      </div>
    </div>
  );
};

export default UserCard;
