import React, { useState } from "react";
import './formularioPost.css';
import { ComponentChecklist } from './Categorias2.jsx';




function Formulario({ onClose }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para manejar el envío del formulario
        onClose();
    };
    const categorias = ['JAVA', 'REACT', 'PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'ANGULAR','C++','GO','RUBY','HIBRIDO'];
    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedComponents, setSelectedComponents] = useState([]);

    const handleSelectedCountChange = (count) => {
        setSelectedCount(count);
    };
    const handleSelectedComponentsChange = (components) => {
        setSelectedComponents(components);
    };

    const enviarPost = () => {
        if (selectedCount > 0) {
            alert("correct");
        } else {
            alert("Selecciona al menos una categoria");
        }
    }
    return (
        <div className='contenidoMayor'>
            <div className="contenidoP">
                <div className="form1">
                    <label className="contenedorEncabezado">
                        <label className="contenedorCh">
                            <label className="tituloCrearPosts">CREAR </label>
                            <input type="checkbox" />
                            <div className="checkmark">
                                <p className="No name">PROYECTO</p>
                                <p className="Yes name">POST</p>
                            </div>
                        </label>
                    </label>
                    <div className='contenedorImg'>
                        
                    </div>
                    <input placeholder="Titulo..." type="text" className="input3" />
                    <textarea placeholder="Contenido..." rows="6" cols="20" id="message" name="message" className="textarea"></textarea>
                    <div className='contenedorArchivo'>
                        <form onSubmit={handleSubmit}>
                            <input
                                accept=".zip, .war"
                                className="inpdddut"
                                name="arquivo"
                                id="arquivo"
                                type="file"
                            />
                        </form>
                    </div>
                    <ComponentChecklist componentList={categorias} onSelectedCountChange={handleSelectedCountChange} onSelectedComponentsChange={handleSelectedComponentsChange}/>
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
