import './Home.css';
import { useEffect, useState } from 'react'; // Importa useEffect y useState
import { parseJwt } from '../Main/Main'; // Asegúrate de importar la función parseJwt desde el archivo correcto
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaUser } from 'react-icons/fa';
import Categorias from './Categorias'; // Importar el componente Categorias

const Home = () => {
    // Estado para almacenar la información del usuario decodificada
    const [userData, setUserData] = useState(null);
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
        // Obtiene el token del almacenamiento local
        const token = localStorage.getItem('token');

        if (token) {
            // Decodifica el token y establece los datos del usuario en el estado
            const decodedToken = parseJwt(token);
            setUserData(decodedToken);
        }
    }, []); // El efecto se ejecuta solo una vez al montar el componente

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
                            
                        </div>
                    </div>
                    <div className='contCentral'>
                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />                        Contenedor Central<br />
                        Contenedor Central<br />
                        Contenedor Central<br />
                    </div>
                    <div className='contDerecho'>
                        <div className='contenidoD'>
                            <div className='tituloDerecho'> DESARROLLADORES: </div>
                            <div className='contenedorImagen'>
                                <img
                                    src={"src/componentesFront/Login/images/iconoMichael.png"}
                                    alt="Miniatura"
                                    style={{ width: '50px', height: '50px' }} // Establece el tamaño deseado
                                />
                                <label>
                                    Michael Chavez
                                </label>
                            </div>
                            <div className='contenedorImagen'>
                                <img
                                    src={"src/componentesFront/Login/images/perfilD.jpg"}
                                    alt="Miniatura"
                                    style={{ width: '50px', height: '50px' }} // Establece el tamaño deseado
                                />
                                <label>
                                    David Giler
                                </label>
                            </div>
                            <div className='contenedorImagen'>
                                <img
                                    src={""}
                                    alt="Miniatura"
                                    style={{ width: '50px', height: '50px' }} // Establece el tamaño deseado
                                />
                                <label>
                                    Kevin Peñafiel
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </>
    );
}

export default Home;

