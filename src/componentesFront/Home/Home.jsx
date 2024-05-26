// src/componentesFront/Home/Home.jsx
import './Home.css';
import { useEffect, useState } from 'react';
import { parseJwt } from '../Main/Main';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaUser } from 'react-icons/fa';
import Categorias from './Categorias';
import axios from 'axios';

const Home = () => {
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    let buttonText = "";
    let direct = null;
    const token = localStorage.getItem('token');
    const tokenExistAndStillValid = token && parseJwt(token).exp * 1000 > Date.now();
    
    if (tokenExistAndStillValid) {
        buttonText = 'Crear Posts';
        direct = '/posts';
    } else {
        buttonText = 'Iniciar Sesion';
        direct = '/login';
    }

    useEffect(() => {
        if (token) {
            const decodedToken = parseJwt(token);
            setUserData(decodedToken);
        }
    }, [token]);

    const handleCategoriaClick = async (categoriaId) => {
        try {
            const response = await axios.get(`http://localhost:3000/consultaPostCat?categoriaId=${categoriaId}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error al cargar los posts:', error);
        }
    };

    return (
        <>
            <div className='contedorPrincipal'>
                <div className='barra-navegacion'>
                    <div className="logo-container">
                        <img src="src/componentesFront/Login/images/logoApp1.png" alt="Logo" />
                    </div>
                    <div className="buscador">
                        <input className='inputB' type="text" placeholder="Search" />
                        <FaSearch className="iconoBuscar" />
                    </div>
                    <Link className='btnInicioSesion' id='btnP' to={direct}>{buttonText}</Link>
                </div>
                <div className='cont'>
                    <div className='contIzquierdo'>
                        <div className='contNav'>
                            <Link className='btnNav' to="/"><FaHome size={25} className='icon' /> Home</Link>
                            <Link className='btnNav' to="/perfil"><FaUser size={25} className='icon' /> Perfil</Link>
                        </div>
                        <div className='contCategorias'>
                            <button id="botonPrincipal">Categorias</button>
                            <Categorias onCategoriaClick={handleCategoriaClick} />
                        </div>
                    </div>
                    <div className='contCentral'>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id} className="post">
                                    <h3>{post.titulo}</h3>
                                    <p>{post.contenido}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay posts disponibles.</p>
                        )}
                    </div>
                    <div className='contDerecho'>
                        <div className='contenidoD'>
                            <div className='tituloDerecho'> DESARROLLADORES: </div>
                            <div className='contenedorImagen'>
                                <img
                                    src={"src/componentesFront/Login/images/iconoMichael.png"}
                                    alt="Miniatura"
                                    style={{ width: '50px', height: '50px' }} 
                                />
                                <label>Michael Chavez</label>
                            </div>
                            <div className='contenedorImagen'>
                                <img
                                    src={"src/componentesFront/Login/images/perfilD.jpg"}
                                    alt="Miniatura"
                                    style={{ width: '50px', height: '50px' }} 
                                />
                                <label>David Giler</label>
                            </div>
                            <div className='contenedorImagen'>
                                <img
                                    src={""}
                                    alt="Miniatura"
                                    style={{ width: '50px', height: '50px' }} 
                                />
                                <label>Kevin Peñafiel</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
