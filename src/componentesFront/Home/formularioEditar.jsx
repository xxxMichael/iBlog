import React, { useState, useEffect } from "react";
import "./formularioPost.css";
import { ComponentChecklist } from "./Categorias3.jsx";
import axios from "axios";
import { parseJwt } from "../Main/Main";
import { host } from "./Home";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [categoria1, setCategoria1] = useState("");
  const [categoria2, setCategoria2] = useState("");
  const [categoria3, setCategoria3] = useState("");
  const [id, setID] = useState("");
  const [image, setImage] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [archivo, setArchivo] = useState(null);
  const [cambioI, setCambioI] = useState(false);
  useEffect(() => {
    if (infor.length > 0) {
      setTitulo(infor[0]);
      setContenido(infor[1]);
      setUrlImagen(infor[2]);
      setCategoria1(infor[3]);
      setCategoria2(infor[4]);
      setCategoria3(infor[5]);
      setImage(infor[2] + "?${new Date().getTime()}"); // Asumiendo que urlImagen es la URL de la imagen
      setID(infor[6]);
    }
  }, [infor]);
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`https://${host}/consultarCatego`);
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
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
  const cantCaracteres = () => {
    return contenido.length;
  };
  const idcat1 = selectedComponents.length >= 1 ? selectedComponents[0] : null;
  const idcat2 = selectedComponents.length >= 2 ? selectedComponents[1] : null;
  const idcat3 = selectedComponents.length >= 3 ? selectedComponents[2] : null;
  const getFileNameFromUrl = (url) => {
    const path = url.split("/").pop();
    const fileName = path.split("?")[0];
    return fileName;
  };

  const editarPost = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (titulo.trim() === "") {
      toast.error("Ingrese un titulo", {
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

      return;
    }

    if (contenido.trim() === "") {
      toast.error("Ingrese contenido", {
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
      return;
    }

    if (selectedCount === 0) {
      toast.error("Seleccione al menos una categoria", {
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
      return;
    }

    try {
      if (cambioI && archivo) {
        const fileName = getFileNameFromUrl(urlImagen);
        const formData = new FormData();
        formData.append("file", archivo);
        formData.append("fileName", fileName);

        const responseImagen = await axios.post(
          `https://${host}/actualizarI`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (responseImagen.status === 200) {
          console.log("Exito al cambiar imagen");
        } else {
          console.error("Error al cambiar imagen:", responseImagen.statusText);
          return;
        }
      }

      const data = {
        titulo: titulo,
        contenido: contenido,
        idCategoria1: idcat1,
        idCategoria2: idcat2,
        idCategoria3: idcat3,
        id: id,
      };

      const response = await fetch(`https://${host}/actualizarPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Se actualizó correctamente el post", {
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

        onClose();
        window.location.reload();
      } else {
        console.error("Error al actualizar el post:", response.statusText);
      }
    } catch (error) {
      console.error("Error en el proceso:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (
      (file && file.type === "image/jpeg") ||
      file.type === "image/jpg" ||
      file.type === "image/png"
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setArchivo(file);
        setCambioI(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 250) {
      setContenido(inputValue);
      setContenido(event.target.value);
    }
  };
  const handleChangeTitulo = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 25) {
      setTitulo(inputValue);
      setTitulo(event.target.value);
    }
  };
  return (
    <div className="contenidoMayor-ed">
      <div className="contenidoP">
        <div className="form1-ed">
          <div className="contenedorImg-ed" id="fileInput">
            {!image && (
              <p className="textImg">Haz clic para seleccionar una imagen</p>
            )}
            {image && (
              <img
                src={image}
                alt="Imagen seleccionada"
                style={{ width: "100%", height: "100%" }}
              />
            )}
            <input
              type="file"
              accept="image/jpeg, image/png"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
              onChange={handleImageChange}
            />
          </div>
          <input
            placeholder="Titulo..."
            type="text"
            className="input3"
            value={titulo}
            onChange={handleChangeTitulo}
          />
          <textarea
            placeholder="Contenido..."
            rows="6"
            cols="20"
            id="message"
            name="message"
            className="textarea"
            value={contenido}
            onChange={handleChange}
          ></textarea>
          <label className="caracteres">{cantCaracteres()}/250</label>
          <ComponentChecklist
            componentList={categorias}
            initialSelected={[categoria1, categoria2, categoria3]}
            onSelectedCountChange={handleSelectedCountChange}
            onSelectedComponentsChange={handleSelectedComponentsChange}
          />
          <div className="contBotones">
            <div onClick={editarPost} className="btnEnviar1">
              Edit
            </div>
            <div onClick={onClose} className="btnCancelar1">
              Cancelar
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

    </div>
  );
}

export default FormularioEditar;