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
    }, [username]);

    return (
              
        <div className="intereses-perfil">
            <table>
                <thead>
                    <tr>
                       
                        <th>Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    {intereses.map((interes) => (
                        <tr key={interes.id}>
                       
                            <td>{interes.nombre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style>{`
            /* Estilos para la estructura de la tabla en InteresesPerfil */
.intereses-perfil {
  margin-top: 20px;
}

.intereses-perfil table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  background-color: #272528;
  color: white;
}

.intereses-perfil th,
.intereses-perfil td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
}

.intereses-perfil th {
  background-color: #2c90fbcd;
  color: white;
  font-weight: bold;
}

.intereses-perfil tbody tr:nth-child(even) {
  background-color: #373439c4;
}

.intereses-perfil tbody tr:hover {
  background-color: #0056b3;
  cursor: pointer;
}

.intereses-perfil td {
  font-size: medium;
}

            `}</style>
        </div>
  
    );
};

export default InteresesPerfil;
