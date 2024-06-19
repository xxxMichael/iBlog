import React, { useState, useEffect } from "react";
import "./formularioPost.css";
import { ComponentChecklist } from "./Categorias2.jsx";
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

function Formulario({ onClose }) {
  const [categorias, setCategorias] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [image, setImage] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [content, setContent] = useState("");
  const [isProject, setIsProject] = useState(true);
  const [dueño, setDueño] = useState("");
  const [tit, setTit] = useState("");
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [archivoCompleto, setArchivoCompleto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
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
  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 250) {
      setContent(inputValue);
      setContenido(event.target.value);
    }
  };
  const handleChangeTitulo = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 25) {
      setTit(inputValue);
      setTitulo(event.target.value);
    }
  };

  const cambiarArchivoCompleto = (e) => {
    const file = e.target.files[0];
    const maxSize = 1 * 1024 * 1024; // Tamaño máximo en bytes (5 MB)
    const input = e.target;

    if (file) {
      const validTypes = [
        "application/zip",
        "application/x-zip-compressed",
        "application/x-zip",
        "application/octet-stream",
        "application/java-archive",
      ];
      if (!validTypes.includes(file.type)) {
        alert("El archivo debe ser de tipo .zip o .war");
        input.value = ""; // Limpiar el input de archivo
        return;
      }

      if (file.size > maxSize) {
        alert("El archivo debe ser menor de 1 MB");
        input.value = ""; // Limpiar el input de archivo
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setArchivoCompleto(file);
        alert("Archivo Correcto"); // Limpiar cualquier error anterior
      };
      reader.readAsDataURL(file);
    }
  };

  const cantCaracteres = () => {
    return content.length;
  };

  const idCategoria1 =
    selectedComponents.length >= 1 ? selectedComponents[0] : null;
  const idCategoria2 =
    selectedComponents.length >= 2 ? selectedComponents[1] : null;
  const idCategoria3 =
    selectedComponents.length >= 3 ? selectedComponents[2] : null;

  const enviarPost = async (e) => {
    e.preventDefault();
    if (tit.trim() === "") {
      toast.error("Ingrese titulo", {
        position: "top-right",
        autoClose: 5000,
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

    if (content.trim() === "") {
      toast.error("Ingrese contenido", {
        position: "top-right",
        autoClose: 5000,
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
      toast.error("Selecciona al menos una categoria", {
        position: "top-right",
        autoClose: 5000,
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
      let urlImagen = "";
      let urlDocumento = "";

      // Subida de imagen
      if (archivo) {
        const formData = new FormData();
        formData.append("file", archivo);

        const responseImagen = await axios.post(
          `https://${host}/subida`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (responseImagen.status === 200) {
          urlImagen = responseImagen.data.urlImagen;
        } else {
          console.error("Error al subir la imagen:", responseImagen.statusText);
          return;
        }
      }

      // Subida de archivo completo
      if (archivoCompleto) {
        const formDatas = new FormData();
        formDatas.append("file", archivoCompleto);

        const responseArchivo = await axios.post(
          `https://${host}/subirArchivos`,
          formDatas,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (responseArchivo.status === 200) {
          urlDocumento = responseArchivo.data.urlDocumento;
        } else {
          console.error("Error al subir el Archivo:", responseArchivo.statusText);
          return;
        }
      }

      // Formateo de la fecha y hora actual
      const fechaHora = new Date();
      const año = fechaHora.getFullYear();
      const mes = (fechaHora.getMonth() + 1).toString().padStart(2, "0");
      const dia = fechaHora.getDate().toString().padStart(2, "0");
      const horas = fechaHora.getHours().toString().padStart(2, "0");
      const minutos = fechaHora.getMinutes().toString().padStart(2, "0");
      const segundos = fechaHora.getSeconds().toString().padStart(2, "0");
      const fechaFormateada = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

      const data = {
        dueño: dueño,
        titulo: titulo,
        contenido: contenido,
        urlImagen: urlImagen,
        urlDocumento: urlDocumento,
        fechaPublicacion: fechaFormateada,
        idCategoria1: idCategoria1,
        idCategoria2: idCategoria2,
        idCategoria3: idCategoria3,
      };

      // Envío del post
      const responsePost = await fetch(`https://${host}/almacenarPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });


      if (responsePost.ok) {
        toast.success("Se agregó correctamente el nuevo post", {
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
       
        setTimeout(() => {
          window.location.reload();
        }, 700);      } else {
        console.error("Error al almacenar el post:", responsePost.statusText);
        alert("Error al almacenar el post: " + responsePost.statusText);
      }
    } catch (error) {
      console.error("Error en el proceso:", error);
      alert("Error en el proceso: " + error.message);
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const maxSize = 1 * 1024 * 1024; // 2 MB en bytes
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png")
    ) {
      if (file.size <= maxSize) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          setArchivo(file);
        };
        reader.readAsDataURL(file);
      } else {
        alert(
          "La imagen seleccionada es demasiado grande. Por favor, elige una imagen menor a 1 MB."
        );
      }
    } else {
      alert(
        "Formato de archivo no válido. Solo se permiten imágenes JPEG, JPG y PNG."
      );
    }
  };

  const vaciarCampos = () => {
    setTit("");
    setContent("");
  };

  const handleDivClick = () => {
    document.getElementById("fileInput").click();
  };
  return (
    <div className="contenidoMayor">
      <div className="contenidoP">
        <div className="form1">
          <label className="contenedorEncabezado">
            <h3
              className={!isProject ? "opcionPr encendido" : "opcionPr apagado"}
            >
              PROYECTO
            </h3>
            <label className="toggle">
              <input
                type="checkbox"
                id="btn"
                onChange={() => setIsProject(!isProject)}
                checked={isProject}
              />
              <label htmlFor="btn"></label>
            </label>
            <h3
              className={!isProject ? "opcionPs apagado" : "opcionPs encendido"}
            >
              POST
            </h3>
          </label>
          <div
            className="contenedorImg"
            id="fileInput"
            onClick={handleDivClick}
          >
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
            onChange={handleChangeTitulo}
            value={tit}
          />
          <textarea
            placeholder="Contenido..."
            rows="6"
            cols="20"
            id="message"
            name="message"
            className="textarea"
            value={content}
            onChange={handleChange}
          ></textarea>
          <label className="caracteres">{cantCaracteres()}/250</label>
          {!isProject && (
            <div className="contenedorArchivo">
              <form>
                <input
                  accept=".zip, .war"
                  className="inputArchivo"
                  type="file"
                  onChange={cambiarArchivoCompleto}
                />
              </form>
            </div>
          )}

          <ComponentChecklist
            componentList={categorias}
            onSelectedCountChange={handleSelectedCountChange}
            onSelectedComponentsChange={handleSelectedComponentsChange}
          />
          <div className="contBotones">
            <div onClick={enviarPost} className="btnEnviar1">
              Send
            </div>
            <div
              onClick={onClose}
              onChange={vaciarCampos}
              className="btnCancelar1"
            >
              Cancelar
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      </div>
  );
}

export default Formulario;
