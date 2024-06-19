import React, { useState, useEffect } from 'react';
import './categorias.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
const ComponentChecklist = ({ componentList, onSelectedCountChange, onSelectedComponentsChange }) => {
    const [selectedComponentIds, setSelectedComponentIds] = useState([]);

    useEffect(() => {
        onSelectedComponentsChange(selectedComponentIds);
    }, [selectedComponentIds, onSelectedComponentsChange]);

    const handleCheckboxChange = (event, component) => {
        const { id } = component;
        const isChecked = event.target.checked;

        if (isChecked) {
            if (selectedComponentIds.length < 3) {
                setSelectedComponentIds([...selectedComponentIds, id]);
                console.log(id);
            } else {
                event.target.checked = false;

                toast.error("Solo puedes elegir tres componentes", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: {
                      background: "#272528",
                      color: "#ffffff",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    },
                  });
            }
        } else {
            setSelectedComponentIds(selectedComponentIds.filter(selectedId => selectedId !== id));
        }

        onSelectedCountChange(selectedComponentIds.length + (isChecked ? 1 : -1));
    };

    return (
        <div className='contenedor-Categorias'>
            {componentList.map((component) => (
                <div
                    className={`categoria-Separada ${selectedComponentIds.includes(component.id) ? 'categoriaSeleccionada' : ''}`}
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
                        <ToastContainer />

        </div>
    );
};

export { ComponentChecklist };
