import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { host } from "./Home";
import { decodificar } from "./Home";
import '../Home/admPosts.css';

const AdmPosts = () => {
    const [postU, setPostU] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = decodificar(token);
            console.log("Decoded token:", decoded);
            if (decoded) {
                const fetchPosts = async () => {
                    try {
                        const response = await axios.get(
                            `http://${host}:3000/consultarpostsUsuario?usuarioP=${decoded.username}`
                        );
                        setPostU(response.data);
                    } catch (error) {
                        console.error('Error al obtener los Posts:', error);
                    }
                };
                fetchPosts();
            }
        }
    }, []);

    return (
        <>
            <div className="contPosts">
                <Link className='btnHome' to='/perfil'>Regresar</Link>
                <label className="tituloMP"> MIS POSTS</label>
                {postU.length > 0 ? (
                    postU.map((post) => (
                        <div key={post.idPost} className="postUsuario">
                            <div className="PropioPost">
                                <label className="titulo-Post">{post.titulo}</label>
                                <div className="PropioPost">
                                    <img className="img-Post" src={post.urlImagen} alt="imagen del Post" />
                                </div>
                                <p className="post-Contenido">{post.contenido}</p>
                                <div className="cont-Cat">
                                    <label className="cat-Post">{post.categoria1}</label><br />
                                    <label className="cat-Post">{post.categoria2}</label><br />
                                    <label className="cat-Post">{post.categoria3}</label>
                                </div>
                                <div className="cont-btns">
                                    <button value={post.idPost} className="btn-Editar"> EDITAR </button>
                                    <button className="btn-Borrar"> BORRAR </button>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <p className="mensajePostsVacios">No hay posts disponibles.</p>
                )}
            </div>
        </>
    );
};

export default AdmPosts;
