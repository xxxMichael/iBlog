import './Home.css';
import { useEffect, useState } from 'react'; // Importa useEffect y useState
import { parseJwt } from '../Main/Main'; // Asegúrate de importar la función parseJwt desde el archivo correcto

const Home = () => {
    // Estado para almacenar la información del usuario decodificada
    const [userData, setUserData] = useState(null);

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
        <div className="container">
            <div className="left-panel">
                <h2>Categorias</h2>
                <button> categoria1 </button>
                <button> categoria2 </button>
                <button> categoria3 </button>
            </div>
            <div className="main-panel">
                <h2>POSTS Y PROYECTOS</h2>
                <div className="scrollable-content">
                    <div className="image-container">
                        <img
                            src="../Login" // URL de la imagen
                            alt="Ejemplo" // Texto alternativo para accesibilidad
                            className="image"
                        />
                    </div>
                </div>
            </div>
            <div className="right-panel">
                <h2>Panel Derecho</h2>
                <p>Contenido estable a la derecha</p>
                {/* Muestra la información del usuario si está disponible */}
                {userData && (
                    <div>
                        <p>Usuario: {userData.username}</p>
                        {/* Agrega más campos según la estructura de tu token */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
