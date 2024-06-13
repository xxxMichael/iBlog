import React, { useState, useEffect } from "react";
import './formularioPost.css';
import { ComponentChecklist } from './Categorias2.jsx';
import axios from 'axios';
import { parseJwt } from "../Main/Main";
import { host } from './Home';

export function decodificar(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

function FormularioEditar({ onClose, infor }) {
    const [categorias, setCategorias] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [urlImagen, setUrlImagen] = useState('');
    const [categoria1, setCategoria1] = useState('');
    const [categoria2, setCategoria2] = useState('');
    const [categoria3, setCategoria3] = useState('');
    const [image, setImage] = useState(null);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);

    useEffect(() => {
        if (infor.length > 0) {
            setTitulo(infor[0]);
            setContenido(infor[1]);
            setUrlImagen(infor[2]);
            setCategoria1(infor[3]);
            setCategoria2(infor[4]);
            setCategoria3(infor[5]);
            setImage(infor[2]); // Asumiendo que urlImagen es la URL de la imagen
        }
    }, [infor]);
    const handleSelectedCountChange = (count) => {
        setSelectedCount(count);
    };
    const handleSelectedComponentsChange = (components) => {
        setSelectedComponents(components);
    };
    const cantCaracteres = () => {
        return contenido.length;
    };

    const editarPost = async () => {
        // Lógica para editar el post
    };

    return (
        <div className='contenidoMayor'>
            <div className="contenidoP">
                <div className="form1">
                    <div className='contenedorImg' id='fileInput'>
                        {!image && <p className="textImg">Haz clic para seleccionar una imagen</p>}
                        {image && <img src={image} alt="Imagen seleccionada" style={{ width: '100%', height: '100%' }} />}
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                        />
                    </div>
                    <input
                        placeholder="Titulo..."
                        type="text"
                        className="input3"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <textarea
                        placeholder="Contenido..."
                        rows="6"
                        cols="20"
                        id="message"
                        name="message"
                        className="textarea"
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                    ></textarea>
                    <label className="caracteres">{cantCaracteres()}/250</label>
                    <div className='contenedorArchivo'>
                        <form>
                            <input
                                accept=".zip, .war"
                                className="inputArchivo"
                                name="archivo"
                                id="archivo"
                                type="file"
                            />
                        </form>
                    </div>
                    <ComponentChecklist componentList={categorias} onSelectedCountChange={handleSelectedCountChange} onSelectedComponentsChange={handleSelectedComponentsChange} />
                    <div className="contBotones">
                        <div onClick={editarPost} className="btnEnviar1">Edit</div>
                        <div onClick={onClose} className="btnCancelar1">Cancelar</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormularioEditar;
