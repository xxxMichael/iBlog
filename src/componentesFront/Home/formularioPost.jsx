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


function Formulario({ onClose }) {
    const [categorias, setCategorias] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [image, setImage] = useState(null);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [content, setContent] = useState('');
    const [isProject, setIsProject] = useState(true);
    const [dueño, setDueño] = useState("");
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    //const [urlImagen, setUrlImagen] = useState("");
    //const [urlDocumento, setUrlDocumento] = useState("");
    //const [idCategoria1, setIdCategoria1] = useState("");
    //const [idCategoria2, setIdCategoria2] = useState("");
    //const [idCategoria3, setIdCategoria3] = useState("");
    const [fechaPublicacion, setFechaPublicacion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para manejar el envío del formulario
        onClose();
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = parseJwt(token);
            setDueño(decodedToken.username);
        }
    }, []);
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`http://${host}:3000/consultarCatego`);
                setCategorias(response.data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };
        fetchCategorias();
    }, []);
    const handleSelectedCountChange = (count) => {
        setSelectedCount(count);
    };
    const handleSelectedComponentsChange = (components) => {
        setSelectedComponents(components);
    };
    const handleChange = (event) => {
        const inputValue = event.target.value;
        if (inputValue.length <= 250) {
            setContent(inputValue);
            setContenido(event.target.value);
        }
    };
    const cantCaracteres = () => {
        return content.length;
    };
    const enviarPost = async (e) => {
        e.preventDefault();
        if (selectedCount > 0) {
            const currentDateTime = new Date();
            setFechaPublicacion(currentDateTime);
            const formData = new FormData();
            formData.append('dueño', dueño);
            formData.append('titulo', titulo);
            formData.append('contenido', contenido);
            //formData.append('urlDocumento', urlDocumento);
            //formData.append('idCategoria1', idCategoria1);
            //formData.append('idCategoria2', idCategoria2);
            //formData.append('idCategoria3', idCategoria3);
            formData.append('fechaPublicacion', fechaPublicacion);
            console.log(dueño);
            console.log(titulo);
            console.log(contenido);
            console.log(fechaPublicacion);

            if (image) {
                formData.append('image', image);
            }

            try {
                const response = await fetch(`http://${host}:3000/almacenarPost`, {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    alert('Se agrego correctamente el nuevo post');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert("Selecciona al menos una categoria");
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDivClick = () => {
        document.getElementById('fileInput').click();
    };
    return (
        <div className='contenidoMayor'>
            <div className="contenidoP">
                <div className="form1">
                    <label className="contenedorEncabezado">
                        <h3 className={!isProject ? 'opcionPr encendido' : 'opcionPr apagado'}>PROYECTO</h3>
                        <label className="toggle">
                            <input type="checkbox" id="btn" onChange={() => setIsProject(!isProject)} checked={isProject} />
                            <label htmlFor="btn"></label>
                        </label>
                        <h3 className={!isProject ? 'opcionPs apagado' : 'opcionPs encendido'}>POST</h3>
                    </label>
                    <div className='contenedorImg' id='fileInput' onClick={handleDivClick}>
                        {!image && <p className="textImg">Haz clic para seleccionar una imagen</p>}
                        {image && <img src={image} alt="Imagen seleccionada" style={{ width: '100%', height: '100%' }} />}
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            onChange={handleImageChange}
                        />
                    </div>
                    <input placeholder="Titulo..." type="text" className="input3" onChange={(e) => setTitulo(e.target.value)} />
                    <textarea placeholder="Contenido..." rows="6" cols="20" id="message" name="message" className="textarea"
                        value={content} onChange={handleChange} ></textarea>
                    <label className="caracteres">{cantCaracteres()}/250</label>
                    {!isProject && (
                        <div className='contenedorArchivo'>
                            <form onSubmit={handleSubmit}>
                                <input
                                    accept=".zip, .war"
                                    className="inputArchivo"
                                    name="arquivo"
                                    id="arquivo"
                                    type="file"
                                />
                            </form>
                        </div>
                    )}

                    <ComponentChecklist componentList={categorias} onSelectedCountChange={handleSelectedCountChange} onSelectedComponentsChange={handleSelectedComponentsChange} />
                    <div className="contBotones">
                        <div onClick={enviarPost} className="btnEnviar1">Send</div>
                        <div onClick={onClose} className="btnCancelar1">Cancelar</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Formulario;
