// Categorias.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from './Home';

const Categorias = ({ onCategoriaClick,setCategoriasEnHome  }) => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`https://${host}/consultarCatego`);
                setCategorias(response.data);
                if (setCategoriasEnHome && typeof setCategoriasEnHome === 'function') {
                    setCategoriasEnHome(response.data); // Pasa las categorías al componente padre (Home)
                }

            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };
        fetchCategorias();
    }, []); 

    return (
        <ul>
            {categorias.map((categoria) => (
                <li key={categoria.id}>
                    <button className='btns-Categorias' onClick={() => onCategoriaClick(categoria.id)}>
                    {categoria.nombre}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default Categorias;
