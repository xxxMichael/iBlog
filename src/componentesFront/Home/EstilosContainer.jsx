import React from "react";

const EstilosContainer = () => {
  return (
    <style>
      {`
      @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+128+Text&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
     
           
        :root {
          --color-uno: rgb(39, 150, 175);
          --color-dos: #5b41f2;
          --color-fondo:black;
          --color-claro: #fefefe;
        }

        *,
        ::before,
        ::after {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: "Dosis", sans-serif;
          font-size: 62.5%;
          background-color: var(--color-fondo);
          
        }

        .contenedor,
        section {  
          height: 100vh;
        }

        .contenedor {
          position: relative;
          width: 100%;
          overflow: hidden;
          background-color: transparent;
        }

        .contenedor::before,
        .contenedor::after {
          position: absolute;
          width: 350px;
          height: 350px;
          content: "";
          border-radius: 54% 46% 42% 58% / 60% 58% 42% 40%;
          background-image: linear-gradient(45deg, var(--color-uno), var(--color-dos));
          animation: vawe 5s linear infinite;
        }

        .contenedor::before {
          top: -10%;
          right: -10%;
        }
        
        .contenedor::after {
          bottom: -10%;
          left: -15%;
        }

        .puntos {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .puntos span {
          position: absolute;
          border-radius: 50%;
          background-image: linear-gradient(45deg, var(--color-uno), var(--color-dos));
          border-radius: 38% 62% 55% 45% / 32% 53% 47% 68% ;
          animation: vawe 7s linear infinite;
        }
        
        .puntos span:nth-child(1) {        
          top: 10%;
          left: calc(100% - 360px);
          width: 75px;
          height: 75px;
        }

        .puntos span:nth-child(2) {
          top: 15px;
          left: 180px;
          width: 50px;
          height: 50px;
          border-radius: 38% 62% 33% 67% / 60% 53% 47% 40%;
          transform: rotate(90deg);
        }

        .puntos span:nth-child(3) {
          right: 180px;
          bottom: 20px;
          width: 80px;
          height: 80px;
          border-radius: 38% 62% 55% 45% / 52% 53% 47% 48%;
        }

        .puntos span:nth-child(4) {
          bottom: 50px;
          left: 240px;
          width: 20px;
          height: 20px;
          border-radius: 38% 62% 55% 45% / 52% 53% 47% 48%;
        }

        .puntos span:nth-child(5) {
          right: 280px;
          bottom: 80px;
          width: 25px;
          height: 25px;
          border-radius: 38% 62% 55% 45% / 52% 53% 47% 48%;
        }
        
        .puntos span:nth-child(6) {        
          top: 6%;
          left: calc(100% - 400px);
          width: 25px;
          height: 25px;
        }

        .redimension {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 10px;
          z-index: 2;
          text-transform: uppercase;
          font-size: 1rem;
          color: var(--color-claro);
            cursor: auto; /* Evitar flechas de redimensionamiento */

        }

        .contenido {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          width: 60%;
          padding: 1em;
          border-radius: 0.5em;
         
        }

        .contenido h1 {
          margin: 0;
          font-size: 5vw;
          letter-spacing: 5px;
        }
        
        .contenido a {
          text-decoration: none;
          color: var(--color-uno);
        }

        section {
          padding: 3em 1em;
          font: normal 1rem "Montserrat", sans-serif;
          color: var(--color-fondo);
          background-color: var(--color-claro);
        }

        section h2 {
          margin-bottom: 1em;
        }

        @keyframes vawe {
          20% {
            border-radius: 45% 55% 62% 38% / 53% 51% 49% 47%;
          }
          40% {
            border-radius: 45% 55% 49% 51% / 36% 51% 49% 64%;
          }
          60% {
            border-radius: 60% 40% 57% 43% / 47% 62% 38% 53%;
          }
          80% {
            border-radius: 60% 40% 32% 68% / 38% 36% 64% 62%;
          }
        }
         .contenedor {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 20px;
        }

        .user-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #272528;
          padding: 20px;
          border-radius: 10px;
          color: white;
          width: 100%;

      }
        .backHome{
          margin-top:12px;
          position: relative;
        }
      .profile-picture {
          position: relative;
          margin-top: -50px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom:-13px;
      }

      .profile-picture img {
          width: 100%;
          height: auto;
      }

      .user-info {
          text-align: center;
          margin-top: 20px;
          font-size:large;

      }

      .username {
          font-family: 'Libre Barcode 128 Text', system-ui;
          font-weight: 400;
          font-style: normal;
          font-size: xxx-large;
          margin-top: 20px;
          margin-bottom: 5px;
      }

      .additional-info {
        font-size: medium;
          margin-top: 15px;
          text-align: center;

      }
        
      .info-item {
          display: inline-block;
          margin: 10px ;

      }

      .info-label,
      .info-value {
      
        margin-bottom: 5px; /* Añade un espacio entre el label y el valor */
        text-align: center; /* Centra el texto */
      }
      .info-label {
          margin-bottom: 5px;
          font-weight: bold;
          font-size: large;

      }

      .info-label+.info-value {
          font-size: large;
            display: flexbox;

      }
.info-value {
  text-decoration: underline; /* Agrega un subrayado al texto */
}

      /* Estilos para los botones de edición */
      .edit-button {
        position: absolute;
        top: 10px;
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      
      .edit-button.edit-posts {
        left: 1%;
      }
      
      .edit-button.edit-categories {
        right: 1%;
      }
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent); /* Fondo semitransparente */
  width: 400px; /* Ancho de la ventana modal */
  padding: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
}

.modal-content {
  background-color: black;
  padding: 20px;
  border-radius: 10px;
}


.modal h2 {
  margin-bottom: 20px;
}

.modal label {
  display: block;
  margin-bottom: 10px;
}

.modal input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.modal edit-posts {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.modal button:hover {
  background-color: #0056b3;
}

      `}
    </style>
  );
};

export default EstilosContainer;
