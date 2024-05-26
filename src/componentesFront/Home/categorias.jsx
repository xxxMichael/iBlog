/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// Categorias.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Categorias = ({ onCategoriaClick }) => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:3000/consultarCatego');
                setCategorias(response.data);
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
                    <button onClick={() => onCategoriaClick(categoria.id)}>
                        {categoria.nombre}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default Categorias;
