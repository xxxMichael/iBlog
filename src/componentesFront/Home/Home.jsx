import './Home.css';
const Home = () => {
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
            </div>
        </div>
    );
}

export default Home;