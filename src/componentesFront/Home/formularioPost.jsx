import React, { useState, useEffect } from "react";
import './formularioPost.css';
import { ComponentChecklist } from './Categorias2.jsx';
import axios from 'axios';

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
    const [urlImagen, setUrlImagen] = useState("");
    const [urlDocumento, setUrlSocumento] = useState("");
    const [idCategoria1, setIdCategoria1] = useState("");
    const [idCategoria2, setIdCategoria2] = useState("");
    const [idCategoria3, setIdCategoria3] = useState("");
    const [fechaPublicacion, setFechaPublicacion] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para manejar el envío del formulario
        onClose();
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setDueño(token);
    }, []);

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
            console.log(titulo);
            console.log(contenido);
            console.log(dueño);
            try {
                const response = await fetch('http://localhost:3000/almacenarPost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dueño, titulo, contenido, urlImagen, urlDocumento, idCategoria1,
                        idCategoria2, idCategoria3, fechaPublicacion
                    }),
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
    }
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
                        <label className="contenedorCh">
                            <label className="tituloCrearPosts">CREAR </label>
                            <input type="checkbox" onChange={() => setIsProject(!isProject)} checked={isProject} />
                            <div className="checkmark">
                                <p className="No name">PROYECTO</p>
                                <p className="Yes name">POST</p>
                            </div>
                        </label>
                    </label>
                    <div className='contenedorImg' onClick={handleDivClick}>
                        {!image && <p>Haz clic para seleccionar una imagen</p>}
                        {image && <img src={image} alt="Imagen seleccionada" style={{ width: '350px', height: '180px' }} />}
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
