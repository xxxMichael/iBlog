import React, { useState, useEffect } from 'react';
import './categorias.css';

const ComponentChecklist = ({ componentList, onSelectedCountChange, onSelectedComponentsChange }) => {
    const [selectedComponents, setSelectedComponents] = useState([]);

    useEffect(() => {
        onSelectedComponentsChange(selectedComponents);
    }, [selectedComponents, onSelectedComponentsChange]);

    const handleCheckboxChange = (event, component) => {
        if (event.target.checked) {
            if (selectedComponents.length < 3) {
                setSelectedComponents([...selectedComponents, component]);
            } else {
                event.target.checked = false;
                alert("You can't select more than three components.");
            }
        } else {
            setSelectedComponents(selectedComponents.filter(comp => comp.nombre !== component.nombre));
        }
        onSelectedCountChange(selectedComponents.length + (event.target.checked ? 1 : -1));
    };

    return (
        <div className='contenedorCategorias'>
            {componentList.map((componente) => (
                <div
                    className={`categoriaSeparada ${selectedComponents.some(comp => comp.nombre === componente.nombre) ? 'categoriaSeleccionada' : ''}`}
                    key={componente.nombre}
                >
                    <input
                        className='inputCh'
                        type="checkbox"
                        id={componente.nombre}
                        onChange={(event) => handleCheckboxChange(event, componente)}
                        checked={selectedComponents.some(comp => comp.nombre === componente.nombre)}
                    />
                    <label htmlFor={componente.nombre}>{componente.nombre}</label>
                </div>
            ))}
        </div>
    );
};

export { ComponentChecklist };


