import React, { useState, useEffect } from 'react';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:3000/consultarCatego');
                const data = await response.json();
                setCategorias(data);
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
                    <a href={`/categoria/${categoria.id}`}>{categoria.nombre}</a>
                </li>
            ))}
        </ul>
    );
};

export default Categorias;
