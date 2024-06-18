import EstilosContainer from "./EstilosContainer";
import { Link } from "react-router-dom";
import Flag from "react-world-flags";
import { FaPen } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { host } from "./Home";
import { decodificar } from "../Home/Home"; // Importa la función decodificar desde el componente Home
import { useNavigate } from "react-router-dom";
import InteresesPerfil from './interesesPerfil'; // Importar el componente InteresesPerfil


const Perfil = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    fechaRegistro: "",
    rol: "",
    fechaNac: "",
    pais: "",
    email: "",
    urlImagenPerfil: "",
  });
  const validateName = (name) => {
    // Verificar si solo contiene letras
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      return false;
    }

    // Verificar que no sea mayor a 50 caracteres
    if (name.length > 50) {
      return false;
    }

    return true;
  };
  const validateCountry = (country) => {
    // Verificar que se haya seleccionado una opción válida
    return country !== "N/A";
  };
  const validateDateOfBirth = (dateOfBirth) => {
    const isValidDate = !isNaN(Date.parse(dateOfBirth));

    // Verificar que la fecha no sea mayor a 100 años ni menor a 12 años
    const currentDate = new Date();
    const twelveYearsAgo = new Date(
      currentDate.getFullYear() - 12,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const oneHundredYearsAgo = new Date(
      currentDate.getFullYear() - 100,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const userDateOfBirth = new Date(dateOfBirth);
    if (
      !isValidDate ||
      userDateOfBirth > twelveYearsAgo ||
      userDateOfBirth < oneHundredYearsAgo
    ) {
      return false;
    }

    return true;
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newDateOfBirth, setNewDateOfBirth] = useState("");
  const [newCountry, setNewCountry] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {};

    if (modalType === "name") {
      data = {
        nombre: newName,
        apellido: newLastName,
      };
      if (!validateName(newName) || !validateName(newLastName)) {
        console.error("Nombre y/o Apellido inválido(s).");
        return;
      }
    } else if (modalType === "dateOfBirth") {
      data = {
        fechaNac: newDateOfBirth,
      };
      if (!validateDateOfBirth(newDateOfBirth)) {
        console.error("Fecha de nacimiento inválida.");

        return;
      }
    } else if (modalType === "country") {
      data = {
        pais: newCountry,
      };
      if (!validateCountry(newCountry)) {
        console.error("Por favor, seleccione un país válido.");
        return;
      }
    }

    const payload = {
      modalType,
      data,
      username: userData.username, // Asegúrate de enviar el username para identificar al usuario
    };

    try {
      const response = await fetch(`https://${host}/guardarCambios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const result = await response.json();
      console.log(result);

      // Aquí puedes manejar la respuesta, actualizar el estado de userData, etc.
      setUserData((prevData) => ({
        ...prevData,
        ...data,
        pais: data.pais ? data.pais.slice(-2).toUpperCase() : prevData.pais, // Recorta el código del país si existe en los datos nuevos
      }));

      setModalOpen(false); // Cierra la ventana modal después de enviar el formulario
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [userInterests, setUserInterests] = useState([]);
  const handleInterestChange = (e, index) => {
    const updatedInterests = [...userInterests];
    updatedInterests[index] = e.target.value;
    setUserInterests(updatedInterests);
  };
  const handleSubmitInterests = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No se encontró un token en el almacenamiento local");
      return;
    }

    const payload = {
      interests: userInterests,
      username: userData.username,
    };

    try {
      const response = await fetch(`https://${host}/guardarIntereses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const result = await response.json();
      console.log(result);

      // Aquí puedes manejar la respuesta, actualizar el estado si es necesario

      setInterestsModalOpen(false); // Cierra la ventana modal después de enviar el formulario
    } catch (error) {
      console.error("Error al enviar los datos de intereses:", error);
    }
  };

  const handleInterestsEdit = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodificar(token); // Decodificar el token
      setUserInterests(decodedToken.interests); // Obtener las categorías de intereses desde el token
      setInterestsModalOpen(true); // Abrir la ventana modal de intereses
    } else {
      console.error("No se encontró un token en el almacenamiento local");
    }
  };

  const handleEdit = () => {
    setModalOpen(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token == null) {
      navigate("/");
    }

    const fetchUserData = async () => {
      try {
        if (token) {
          const decodedToken = decodificar(token); // Decodificar el token
          const username = decodedToken.username;
          const response = await axios.get(
            `https://${host}/consultarUser?username=${username}`
          );
          let fechaRegistro = "N/A";
          let fechanac = "N/A";
          let paisCodigo = "N/A";
          let urlImagenPerfil = "";

          if (response.data.fechaRegistro) {
            fechaRegistro = new Date(response.data.fechaRegistro)
              .toISOString()
              .split("T")[0];
          }

          if (response.data.fechaNac) {
            fechanac = new Date(response.data.fechaNac)
              .toISOString()
              .split("T")[0];
          }

          if (response.data.pais) {
            // Extraer las dos últimas letras del país
            paisCodigo = response.data.pais.slice(-2).toUpperCase();
          }
          if (response.data.urlImagenPerfil) {
            // Extraer las dos últimas letras del país
            urlImagenPerfil = response.data.urlImagenPerfil;
          }

          setUserData({
            ...response.data,
            fechaRegistro: fechaRegistro,
            fechaNac: fechanac,
            pais: paisCodigo,
            urlImagenPerfil: urlImagenPerfil,
          });
        } else {
          // Manejar el caso en que no haya un token en el almacenamiento local
          console.error("No se encontró un token en el almacenamiento local");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  console.log(userData);

  const handleEditName = () => {
    setNewName(userData.nombre); // Establece el valor actual del nombre en el estado newName
    setNewLastName(userData.apellido); // Establece el valor actual del apellido en el estado newLastName
    setModalType("name"); // Establece el tipo de modal como 'name'
    setModalOpen(true); // Abre la ventana modal
  };
  const handleEditDate = () => {
    setNewDateOfBirth(userData.fechaNac); // Establece el valor actual de la fecha de nacimiento en el estado newDateOfBirth
    setModalType("dateOfBirth"); // Establece el tipo de modal como 'dateOfBirth'
    setModalOpen(true); // Abre la ventana modal
  };

  const handleEditCountry = () => {
    setNewCountry(userData.pais); // Establece el valor actual del país en el estado newCountry
    setModalType("country"); // Establece el tipo de modal como 'country'
    setModalOpen(true); // Abre la ventana modal
  };
  const getFileNameFromUrl = (url) => {
    const path = url.split('/').pop();
    const fileName = path.split('?')[0];
    return fileName;
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const maxSize = 1 * 1024 * 1024; // 1 MB en bytes

    if (!file) {
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      alert('Por favor, selecciona un archivo de imagen válido (JPEG, JPG, PNG, GIF).');
      return;
    }

    if (file.size > maxSize) {
      alert('La imagen seleccionada es demasiado grande. Por favor, elige una imagen menor a 1 MB.');
      return;
    }

    try {
      let formData = new FormData();
      formData.append('file', file);

      let responseImagen;

      if (userData.urlImagenPerfil) {
        const fileName = getFileNameFromUrl(userData.urlImagenPerfil);
        formData.append('fileName', fileName);

        responseImagen = await axios.post(`https://${host}/actualizarI`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        responseImagen = await axios.post(`https://${host}/subida`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (responseImagen.status !== 200) {
        console.error('Error al subir la imagen:', responseImagen.statusText);
        return;
      }

      if (!userData.urlImagenPerfil) {
        const nuevaUrlImagenPerfil = responseImagen.data.urlImagen;
        const data = {
          dueño: userData.username,
          urlImagen: nuevaUrlImagenPerfil,
        };

        const responsePost = await fetch(`https://${host}/actualizarFotoPerfil`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!responsePost.ok) {
          console.error('Error al actualizar imagen:', responsePost.statusText);
          return;
        }

        alert('Se actualizó la foto de perfil');
      } else {
        alert('Éxito al cambiar imagen');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error al cambiar imagen:', error);
    }
  };



  const imagenRangoPokemon = () => {
    if (userData.username === 'david21') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/2/20/latest/20141014154627/Mega-Rayquaza.png';
    }
    if (userData.username === 'Liz') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/0/0e/latest/20230705050814/Tepig.png';
    }
    if (userData.username === 'michael') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/7/77/latest/20161114210617/Necrozma.png';
    }
    if (userData.username === 'Kevin') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/1/16/latest/20220313073057/Eternatus.png';
    }
    if (userData.rol === 'Diamante') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/8/88/latest/20150301123501/Mega-Charizard_X.png';
    }
    if (userData.rol === 'Oro') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/9/95/latest/20160817212623/Charizard.png';
    }
    if (userData.rol === 'Plata') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/f/fb/latest/20200411222755/Charmeleon.png';
    }
    if (userData.rol === 'Bronce') {
      return 'https://images.wikidexcdn.net/mwuploads/wikidex/5/56/latest/20200307023245/Charmander.png';
    }
  }
  return (
    <>
      <EstilosContainer />

      <div className="contenedor">
        <div className="puntos">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="contenido">
          <div className="user-profile">
            <Link to="/admPosts" className="edit-button edit-posts">
              Mis posts
            </Link>
            <button
              className="edit-button edit-categories"
              onClick={handleInterestsEdit}
            >
              Intereses
            </button>
            <div className="profile-picture">
              <img
                src={userData.urlImagenPerfil + '?${new Date().getTime()}'} 
                alt="profile"
              />
              <input
                type="file"
                accept="image/jpeg, image/png"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                onChange={handleImageChange}
              />
            </div>
            <div className="user-info">
              <h2>
                {userData.nombre} {userData.apellido}
                <button className="edit-icon" onClick={handleEditName}>
                  <FaPen />
                </button>
              </h2>
              <p className="username">@{userData.username}</p>
              <div className="country-info">
                <Flag code={userData.pais} height="30" />
              </div>
            </div>
            <div className="additional-info">
              <div className="info-item">
                <span className="info-label">Miembro desde: </span>
                <span className="info-value">{userData.fechaRegistro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha de Nacimiento: </span>
                <span className="info-value">{userData.fechaNac}</span>
                <button className="edit-icon" onClick={handleEditDate}>
                  <FaPen />
                </button>
              </div>
              <div className="info-item">
                <span className="info-label">Rango: </span>
                <span className="info-value">{userData.rol}</span>
              </div>
              <div className="info-item">
                <span className="info-label">País: </span>
                <span className="info-value">
                  {userData.pais}
                  <button className="edit-icon" onClick={handleEditCountry}>
                    <FaPen />
                  </button>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Email: </span>
                <span className="info-value">{userData.email}</span>
              </div>
              <div style={{ position: "absolute", bottom: "5%", right: "5%" }}>
                {/* Enlace a la página principal */}
                <Link to="/" className="backHome">
                  Home
                </Link>
              </div>
            </div>
          </div>
          {modalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h2>
                  {modalType === "name"
                    ? "Editar Nombre"
                    : modalType === "dateOfBirth"
                      ? "Editar Fecha de Nacimiento"
                      : "Editar País"}
                </h2>
                <form onSubmit={handleSubmit}>
                  {modalType === "name" ? (
                    <>
                      <label>
                        Nuevo Nombre:
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                      </label>
                      <label>
                        Nuevo Apellido:
                        <input
                          type="text"
                          value={newLastName}
                          onChange={(e) => setNewLastName(e.target.value)}
                        />
                      </label>
                    </>
                  ) : modalType === "dateOfBirth" ? (
                    <label>
                      Nueva Fecha de Nacimiento:
                      <input
                        type="date"
                        value={newDateOfBirth}
                        onChange={(e) => setNewDateOfBirth(e.target.value)}
                      />
                    </label>
                  ) : (
                    <label>
                      Nuevo País:
                      <select
                        id="country"
                        nameclass="select"
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        required
                      >
                        <option value="">Seleccione su país</option>
                        <option value="Argentina AR">Argentina</option>
                        <option value="Bolivia BO">Bolivia</option>
                        <option value="Chile CL">Chile</option>
                        <option value="Colombia CO">Colombia</option>
                        <option value="Costa Rica CR">Costa Rica</option>
                        <option value="Cuba CU">Cuba</option>
                        <option value="Dominicana DO">
                          República Dominicana
                        </option>
                        <option value="Ecuador EC">Ecuador</option>
                        <option value="El Salvador SV">El Salvador</option>
                        <option value="Guatemala GT">Guatemala</option>
                        <option value="Honduras HN">Honduras</option>
                        <option value="México MX">México</option>
                        <option value="Nicaragua NI">Nicaragua</option>
                        <option value="Panamá PA">Panamá</option>
                        <option value="Paraguay PY">Paraguay</option>
                        <option value="Perú PE">Perú</option>
                        <option value="Puerto Rico PR">Puerto Rico</option>
                        <option value="Uruguay UY">Uruguay</option>
                        <option value="Venezuela VE">Venezuela</option>
                      </select>
                    </label>
                  )}
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
          )}
          {interestsModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h2>Sus Intereses</h2>
                <form onSubmit={handleSubmitInterests}>
                  <div>
                    <InteresesPerfil username={userData.username} />

                  </div>
                  <button
                    type="button"
                    onClick={() => setInterestsModalOpen(false)}
                  >
                    Aceptar
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Perfil;
