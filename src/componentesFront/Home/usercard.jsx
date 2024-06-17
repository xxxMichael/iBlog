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
    if (!rol) return "https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/invitado.gif";
    switch (rol.toLowerCase()) {
      case "bronce":
        return "https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/bronce.gif";
      case "plata":
        return "https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/plata.gif";
      case "oro":
        return "https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/oro.gif";
      default:
        return "https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/invitado.gif";
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
