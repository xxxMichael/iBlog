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

    const editarPost = (valor) => {
        console.log("titulo"+valor[0]);
        console.log("contenido"+valor[1]);
        console.log("imagen"+valor[2]);
        console.log("id1"+valor[3]);
        console.log("id2"+valor[4]);
        console.log("id3"+valor[5]);
    }

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
                                    <button onClick={() => editarPost([
                                        post.titulo,
                                        post.contenido,
                                        post.urlImagen,
                                        post.idcategoria1,
                                        post.idcategoria2,
                                        post.idcategoria3
                                    ])} className="btn-Editar"> EDITAR </button>
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
