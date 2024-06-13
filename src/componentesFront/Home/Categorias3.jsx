import React, { useState, useEffect } from 'react';
import './categorias.css';

const ComponentChecklist = ({ componentList, initialSelected, onSelectedCountChange, onSelectedComponentsChange }) => {
    const [selectedComponentIds, setSelectedComponentIds] = useState([]);
    const [cargaI, setCargaI] = useState(false);
    const [cont, setCont] = useState(0);
    // useEffect para inicializar los checkboxes seleccionados inicialmente
    useEffect(() => {
        if (!cargaI) {
            const validInitialSelected = initialSelected.filter(id => id);

            const initiallySelectedIds = componentList
                .filter(component => validInitialSelected.includes(component.id))
                .map(component => component.id);
            
            setSelectedComponentIds(initiallySelectedIds);
            setCont(cont + 1);
            if (cont === 2) {
                setCargaI(true);
                onSelectedCountChange(initialSelected.length);
            }
        }
    }, [componentList, initialSelected, cargaI, onSelectedCountChange]);

    // useEffect para llamar a onSelectedComponentsChange cuando selectedComponentIds cambie
    useEffect(() => {
        if (cargaI) { // Asegura que cargaI sea true antes de llamar onSelectedComponentsChange
            onSelectedComponentsChange(selectedComponentIds);
        }
    }, [selectedComponentIds, onSelectedComponentsChange]);

    const handleCheckboxChange = (event, component) => {
        const { id } = component;
        const isChecked = event.target.checked;

        if (isChecked && selectedComponentIds.length >= 3) {
            event.target.checked = false;
            alert("Solo puedes elegir tres componentes");
            return;
        }

        const updatedSelectedComponentIds = isChecked
            ? [...selectedComponentIds, id]
            : selectedComponentIds.filter(selectedId => selectedId !== id);

        setSelectedComponentIds(updatedSelectedComponentIds);
        onSelectedCountChange(updatedSelectedComponentIds.length);
    };

    return (
        <div className='contenedorCategorias'>
            {componentList.map((component) => (
                <div
                    className={`categoriaSeparada ${selectedComponentIds.includes(component.id) ? 'categoriaSeleccionada' : ''}`}
                    key={component.id}
                >
                    <input
                        className='inputCh'
                        type="checkbox"
                        id={component.id}
                        onChange={(event) => handleCheckboxChange(event, component)}
                        checked={selectedComponentIds.includes(component.id)}
                    />
                    <label htmlFor={component.id}>{component.nombre}</label>
                </div>
            ))}
        </div>
    );
};

export { ComponentChecklist };
