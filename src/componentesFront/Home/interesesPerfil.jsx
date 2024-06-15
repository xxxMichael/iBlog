import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from './Home';

const interesesPerfil = () => {
    const [intereses, setIntereses] = useState([]);

    useEffect(() => {
        const fetchInteresesUsuario = async () => {
            try {
                const response = await axios.get(`https://${host}/interesesUsuario`);
                setIntereses(response.data);
            } catch (error) {
                console.error('Error al obtener los intereses del usuario:', error);
            }
        };
        fetchInteresesUsuario();
    }, []);

    return (
        <div className="intereses-perfil">
            <h2>Intereses del Usuario</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {intereses.map((interes) => (
                        <tr key={interes.id}>
                            <td>{interes.id}</td>
                            <td>{interes.nombre}</td>
                            <td>{interes.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default interesesPerfil;
