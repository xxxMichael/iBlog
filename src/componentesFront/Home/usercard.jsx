import React, { useEffect, useState } from "react";
import { decodificar } from "./Home";
//import 'bootstrap/dist/css/bootstrap.min.css';
import "./UserCard.css";
import { Link } from "react-router-dom";

const UserCard = () => {
  const [userInfo, setUserInfo] = useState({
    username: "invitado",
    rol: "invitado",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodificar(token);
      console.log("Decoded token:", decoded);
      if (decoded) {
        setUserInfo({
          username: decoded.username || "invitado",
          rol: decoded.rol || "invitado",
        });
      }
    }
  }, []);

  const getRoleImage = (rol) => {
    if (!rol) return 'https://images.wikidexcdn.net/mwuploads/wikidex/0/0e/latest/20230705050814/Tepig.png';
    if (userInfo.username === 'david21') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/2/20/latest/20141014154627/Mega-Rayquaza.png';
    }
    if (userInfo.username === 'Kevin') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/1/16/latest/20220313073057/Eternatus.png';
    }
    if (userInfo.username === 'michael') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/7/77/latest/20161114210617/Necrozma.png';
    }
    if (userInfo.username === 'melaAlban') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/4/4e/latest/20191009134017/Ponyta_de_Galar.png';
    }
    switch (rol.toLowerCase()) {
      case "bronce":
        return 'https://images.wikidexcdn.net/mwuploads/wikidex/5/56/latest/20200307023245/Charmander.png';
      case "plata":
        return 'https://images.wikidexcdn.net/mwuploads/wikidex/f/fb/latest/20200411222755/Charmeleon.png';
      case "oro":
        return 'https://images.wikidexcdn.net/mwuploads/wikidex/9/95/latest/20160817212623/Charizard.png';
      case "diamante":
        return 'https://images.wikidexcdn.net/mwuploads/wikidex/8/88/latest/20150301123501/Mega-Charizard_X.png';
      default:
        return 'https://images.wikidexcdn.net/mwuploads/wikidex/0/0e/latest/20230705050814/Tepig.png';
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <div className="card">
      <img
        src={getRoleImage(userInfo.rol)}
        className="card-img-top"
        alt={`${userInfo.rol} badge`}
      />
      <div className="card-body">
        <h5 className="card-title">@{userInfo.username}</h5>
        <p className="card-text">Rango: {userInfo.rol}</p>

        {userInfo.rol !== "invitado" && (
          <Link className="btnPerfil" to="/perfil">
            <span className="spanB">Mi Perfil</span>
          </Link>
        )}
        {userInfo.rol !== "invitado" && (
          <button className="btn-cerrarS" onClick={handleLogout}>
            <span className="spanB">Cerrar Sesion</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
