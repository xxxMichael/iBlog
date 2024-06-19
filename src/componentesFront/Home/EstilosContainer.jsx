import React from "react";

const EstilosContainer = () => {
  return (
    <style>
      {" "}
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
        border-radius: 38% 62% 55% 45% / 32% 53% 47% 68%;
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
        
      .edit-icon{
     background-color: #2c90fbcd;
        border-radius: 10px;
      color:white;

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
        cursor: auto;
        /* Evitar flechas de redimensionamiento */

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


      .profile-picture {
        position: relative;
        margin-top: -50px;
        width: 120px;
        height: 120px;
        border-radius: 25%;
        overflow: hidden;
        margin-bottom: -13px;
      }

      .profile-picture img {
        width: 100%;
        height: auto;
      }

      .user-info {
        text-align: center;
        margin-top: 20px;
        font-size: large;
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
        margin: 10px;
      }

      .info-label,
      .info-value {
        margin-bottom: 5px;
        text-align: center;
      }

      .info-label {
        margin-bottom: 5px;
        font-weight: bold;
        font-size: large;
      }

      .info-label + .info-value {
        font-size: large;
        display: flexbox;
      }

      .info-value {
        text-decoration: underline;
      }

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
        color: white;
        left: 1%;
        padding: 5px 10px;
        text-decoration: none;
        font-size: 15px;

      }
     
      .edit-button.edit-categories {
        right: 1%;
        padding: 5px 10px;
        font-size: 15px;

      }
  .edit-button.edit-contrasena {
        padding: 5px 10px;
        font-size: 15px;

      }

      .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: transparent;
        width: 400px;
        padding: 20px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

      }

      .modal-content {
        background-color: black;
        padding: 20px;
        background-color: #272528;
  border: 2px solid black; /* Añade esta línea para el borde negro */

        border-radius: 10px;
      }

      .modal h2 {
             background-color: #2c90fbcd;
      color :white;
        margin-bottom: 20px;

      }
      
      .modal label {
        display: block;
        margin-bottom: 10px;
                     background-color: #2c90fbcd;
      font-size:12px;
      color :white;
      font-weight: bold;
      }
      #country{
                  background-color: #373439c4;
          color :white;
        }
      .modal input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        margin-bottom: 20px;
          background-color: #373439c4;
        color :white;
        font-weight: bold;
        
      }

      .modal edit-posts {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      }
    .modal button{
   
      background-color: #2c90fbcd;
        border-radius: 10px;
      color:white;
      }
      .modal button:hover {
      
        background-color: #0056b3;
      }

      .backHome {
        position: absolute;
        margin-top: -26px;
        margin-left: -40px;
              background-color: #007bff;
        color : white;
        display: inline-block;
        padding: 5px 10px;
        /* Color de fondo */
        border-radius: 5px;
        /* Bordes redondeados */
        text-decoration: none;
        /* Quitar subrayado */
        font-size: medium;
        /* Tamaño de la fuente */
        font-weight: bold;
        /* Negrita */
        transition: background-color 0.3s ease;
        /* Transición suave para el hover */
      }

         
 


      /* Cambiar el color de fondo cuando el ratón está sobre el enlace */
      .backHome:hover {
        background-color: #0056b3;
        /* Color de fondo en hover */
      }
        
      #editar-imagen-perfil{
        z-index: 1001;
        margin-bottom: -25px;
        cursor: pointer;
      }

      /* Media Queries para Responsividad */
      @media (max-width: 768px) {
        .contenido {
          width: 80%;
          padding: 0.5em;
        }

        .contenedor {
          flex-direction: column;
          align-items: center;
        }

        .user-profile {
          padding: 10px;
        }

        .user-info {
          font-size: medium;
        }

        .username {
          font-size: xx-large;
        }

        .additional-info {
          font-size: small;
        }

        .info-item {
          margin: 5px;
        }

        .edit-button {
          padding: 3px 7px;
          font-size: small;
        }

        .modal {
          width: 90%;
        }
      }

      @media (max-width: 480px) {
        .user-profile {
          width: 100%;
          padding: 0.5em;
          height: 100%;
        }
      }

      @media (max-width: 480px) {
        .contenido {
          width: 90%;
          padding: 0.5em;
          height:60%;
        }

        .username {
          font-size: x-large;
        }

        .edit-button {
          padding: 2px 5px;
          font-size: x-small;
        }

        .modal {
          width: 95%;
        }


        /* Estilo para el enlace "Home" */


        /* Media Query para pantallas de tablet */
        @media (max-width: 768px) {
                 .edit-button.edit-contrasena {
                  padding: 8px 16px;
            font-size: small;

  }

          .backHome {
            padding: 8px 16px;
            font-size: small;
          }
        }

        /* Media Query para pantallas de móviles */
        @media (max-width: 480px) {
                           

                           .edit-button.edit-contrasena {

            color:white;
            padding: 6px 12px;
            font-size: x-small;
            position: relative;
            /* Hacer la posición absoluta para poder moverlo */
            top: 60px;
            /* Ajusta la distancia desde la parte inferior */
            left: -115%;
            /* Centrando horizontalmente */
            transform: translateX(230%);
            /* Centrando horizontalmente */
            
          }
          .backHome {
            color:white;
            padding: 6px 12px;
            font-size: x-small;
            position: relative;
            /* Hacer la posición absoluta para poder moverlo */
            bottom: -15px;
            /* Ajusta la distancia desde la parte inferior */
            left: 50%;
            /* Centrando horizontalmente */
            transform: translateX(230%);
            /* Centrando horizontalmente */
            margin-right: 247px;
            
          }
                 
}

      `}
    </style>
  );
};

export default EstilosContainer;
