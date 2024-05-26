/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './categorias.css';

const ComponentChecklist = ({ componentList, onSelectedCountChange, onSelectedComponentsChange }) => {
    const [selectedComponents, setSelectedComponents] = useState([]);

    useEffect(() => {
        onSelectedComponentsChange(selectedComponents);
    }, [selectedComponents, onSelectedComponentsChange]);

    const handleCheckboxChange = (event, componentName) => {
        if (event.target.checked) {
            if (selectedComponents.length < 3) {
                setSelectedComponents([...selectedComponents, componentName]);
            } else {
                event.target.checked = false;
                alert("You can't select more than three components.");
            }
        } else {
            setSelectedComponents(selectedComponents.filter(comp => comp !== componentName));
        }
        onSelectedCountChange(selectedComponents.length + (event.target.checked ? 1 : -1));
    };

    return (
        <div className='contenedorCategorias'>
            {componentList.map(component => (
                <div
                    className={`categoriaSeparada ${selectedComponents.includes(component) ? 'categoriaSeleccionada' : ''}`}
                    key={component}
                >
                    <input
                        className='inputCh'
                        type="checkbox"
                        id={component}
                        onChange={(event) => handleCheckboxChange(event, component)}
                        checked={selectedComponents.includes(component)}
                    />
                    <label htmlFor={component}>{component}</label>
                </div>
            ))}
        </div>
    );
};

export { ComponentChecklist };


