import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { host } from './Home';
const BuscadorPosts = ({ setPosts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDisabled, setSearchDisabled] = useState(false);

  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      setSearchTerm(event.target.value);
      setSearchDisabled(true);

      try {
        const response = await fetch(`https://${host}/BuscarPostsNombre?nombre=${event.target.value}`);
        if (!response.ok) {
          throw new Error("Error al buscar posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error al buscar posts:", error);
      }

      setSearchDisabled(false);
    }
  };

  return (
    <div className="buscador">
      <input
        className="inputB"
        disabled={searchDisabled}
        type="text"
        placeholder="Search for name of Post"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={handleSearch} // Manejar la tecla Enter
      />
      <FaSearch className="iconoBuscar" />
    </div>
  );
};

export default BuscadorPosts;
