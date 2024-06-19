import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { host } from "./Home";
import { decodificar } from "./Home";
import '../Home/admPosts.css';
import FormularioE from "./formularioEditar.jsx";
import { confirmAlert } from 'react-confirm-alert'; // Asegúrate de importar solo lo que necesitas
import 'react-confirm-alert/src/react-confirm-alert.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
const AdmPosts = () => {
    const [postU, setPostU] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = decodificar(token);
            console.log("Decoded token:", decoded);
            if (decoded) {
                const fetchPosts = async () => {
                    try {
                        const response = await axios.get(
                            `https://${host}/consultarpostsUsuario?usuarioP=${decoded.username}`
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

    const editarPost = (post) => {
        setDatos([
            post.titulo,
            post.contenido,
            post.urlImagen,
            post.idcategoria1,
            post.idcategoria2,
            post.idcategoria3,
            post.idPost,
            post.urlDocumento
        ]);
        setShowForm(true);
    }
    const handleClick = () => {
        setShowForm(!showForm);
    };
    const getFileNameFromUrl = (url) => {
        const path = url.split('/').pop();
        const fileName = path.split('?')[0];
        return fileName;
    }
    const handleDelete = async (post) => {
        if (post.urlImagen) {
            if (post.urlDocumento) {
                const nombreI = getFileNameFromUrl(post.urlImagen);
                await axios.post(`https://${host}/eliminarI`, { nombreI }, {
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then(async function (response) {
                        console.log(response);

                        if (response.status === 200) {
                            console.log('Éxito al eliminar imagen');
                        } else {
                            console.log("Error al eliminar imagen");
                        }
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });
                const nombreA = getFileNameFromUrl(post.urlDocumento);
                await axios.post(`https://${host}/eliminarA`, { nombreA }, {
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then(async function (response) {
                        console.log(response);

                        if (response.status === 200) {
                            console.log('Éxito al eliminar archivo');
                            await eliminarPostSinImagen(post);
                        } else {
                            console.log("Error al eliminar archivo");
                        }
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });
            } else {
                const nombreI = getFileNameFromUrl(post.urlImagen);
                await axios.post(`https://${host}/eliminarI`, { nombreI }, {
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then(async function (response) {
                        console.log(response);

                        if (response.status === 200) {
                            console.log('Éxito al eliminar imagen');
                            await eliminarPostSinImagen(post);
                        } else {
                            console.log("Error al eliminar imagen");
                        }
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });
            }
        } else {
            await eliminarPostSinImagen(post);
        }
    };

    const eliminarPostSinImagen = async (post) => {
        try {
            const response = await fetch(`https://${host}/eliminarPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: post.idPost, dueño: post.dueño }),
            });
            if (response.ok) {
                toast.error('Eliminado correctamente');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('ERROR AL ELIMINAR'); // Mensaje de éxito al eliminar
                console.error('Error al eliminar post:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const eliminarPost = async (post) => {
        confirmAlert({
            title: 'ESTAS SEGURO DE ELIMINAR TU POSTS',
            message: 'Eliminar tus posts, eliminara sus comentarios y no podras recuperarlo,' +
                '\n¿Aun asi deseas continuar?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        handleDelete(post);
                    },
                },
                {
                    label: 'No',
                    onClick: () => console.log('Canceled')
                }
            ]
        });
    };

    const navegarPrincipio = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Opcional: animación suave
        });
    }


    return (
        <>
            <div className="contPosts">
                <Link className='btnHome' to='/perfil'> ⌂ </Link>
                <label className="tituloMP"> MIS POSTS</label>
                {showForm && (
                    <FormularioE onClose={handleClick} infor={datos} />
                )}
                {postU.length > 0 ? (
                    postU.map((post) => (
                        <div key={post.idPost} className="book">
                            <div className="card-ed-post">
                                <div className="project-info">
                                    <span className="lighter-ed-post"
                                    >{post.contenido}.</span
                                    >
                                </div>
                                <div className="cont-Categorias">
                                    {post.categoria1} <br />
                                    {post.categoria2} <br />
                                    {post.categoria3} <br />
                                </div>
                                <div className='cont-Btns-ed-posts'>
                                    <button className="btn-ed-post" onClick={() => editarPost(post)} > EDITAR </button>
                                    <button className="btn-elim-post" onClick={() => eliminarPost(post)}> BORRAR </button>
                                </div>
                            </div>
                            <div className="cover">
                                <div className="card-ed-post">
                                    <p className="titulo-post-user">{post.titulo}</p>
                                    <div className="card-img-ed-post">
                                        {post.urlImagen ? (
                                            <div className="card-imgs pv delete">
                                                <img className="img-Post" src={post.urlImagen + '?${new Date().getTime()}'} alt="imagen del Post" />
                                            </div>
                                        ) : (
                                            <div className="card-imgs pv delete">
                                                <img className="img-Post" src={'https://iblog-archivos.s3.sa-east-1.amazonaws.com/complementosPrincipal/no-hay-foto.jpeg'} alt="imagen del Post" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                    ))
                ) : (
                    <p className="mensajePostsVacios">No hay posts disponibles.</p>
                )}
                <button onClick={navegarPrincipio} className="btn-regresar-Principio">
                    ⬆
                </button>
            </div>
            <ToastContainer />
        </>
    );
};

export default AdmPosts;
