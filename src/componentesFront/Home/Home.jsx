/* eslint-disable no-unused-vars */
// src/componentesFront/Home/Home.jsx
import './Home.css';
import { useEffect, useState } from 'react'; // Importa useEffect y useState
import { parseJwt } from '../Main/Main'; // Asegúrate de importar la función parseJwt desde el archivo correcto
import { Link, Router } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaHome, FaUser } from 'react-icons/fa';
import Categorias from './Categorias.jsx';
import axios from 'axios';
import Formulario from '../Home/formularioPost.jsx';

const Home = () => {
    // Estado para almacenar la información del usuario decodificada
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchDisabled, setSearchDisabled] = useState(false);
    let buttonText = "";
    let direct = null;
    const token = localStorage.getItem('token');
    const tokenExistAndStillValid = token && parseJwt(token).exp * 1000 > Date.now();

    if (tokenExistAndStillValid) {
        buttonText = 'Crear Posts';
        direct = '#';
    } else {
        buttonText = 'Iniciar Sesion';
        direct = '/login';
    }

    const handleClick = (event) => {
        setShowForm(!showForm);
        setSearchDisabled(!showForm);
    };

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
                        <input className='inputB' disabled={searchDisabled} type="text" placeholder="Search" />
                        <FaSearch className="iconoBuscar" />
                    </div>
                    <Link
                        className='btnInicioSesion'
                        id='btnP'
                        onClick={tokenExistAndStillValid ? handleClick : null}
                        to={direct}
                        style={{
                            opacity: !showForm ? 1 : 0,
                            pointerEvents: !showForm ? 'auto' : 'none',
                        }}
                    >
                        {buttonText}
                    </Link>
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
                        {showForm && <Formulario onClose={handleClick} />}
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
                    <div className='contDerecho' style={{ display: showForm ? 'none' : 'block' }}>
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
