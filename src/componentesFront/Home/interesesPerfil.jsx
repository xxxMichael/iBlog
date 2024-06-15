import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from './Home';

const InteresesPerfil = ({ username }) => {
    const [intereses, setIntereses] = useState([]);

    useEffect(() => {
        const fetchInteresesUsuario = async () => {
            try {
                const response = await axios.post(`https://${host}/interesesUsuario`, { username });
                setIntereses(response.data);
            } catch (error) {
                console.error('Error al obtener los intereses del usuario:', error);
            }
        };
        fetchInteresesUsuario();
    }, [username]); // Agregar username como dependencia para que se actualice cuando cambie

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

export default InteresesPerfil;
