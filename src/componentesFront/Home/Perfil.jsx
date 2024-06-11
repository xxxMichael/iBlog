import './Home.css';
import { useEffect, useState } from 'react'; // Importa useEffect y useState
import { decodificar } from '../Home/Home'; // Asegúrate de importar la función parseJwt desde el archivo correcto
import { Link } from 'react-router-dom';

const Perfil = () => {
    return (
        <>
            <div className='contenedor-Principal'>
                Hola Mundo
                <Link to='/'>Regresar Menu</Link>
            </div>
        </>

    );
}

export default Perfil;