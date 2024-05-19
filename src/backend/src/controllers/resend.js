const { Resend } = require('resend');
const resend = new Resend('re_XKj47q8s_Lg9tQ3mLojXPQBHrsYaio2yK');
const path = require('path');

async function sendEmail(codigoVerificacion, recipientEmail) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: 'Código de Verificación',
      html: `  
      <html>
          <head>
              <style>
                  /* Estilos para resaltar el código */
                  .codigo {
                    background-color: #7eafc4; 
color: #191515; 
padding: 10px;
font-family: 'Arial', sans-serif;
font-size: 18px; 
border-radius: 5px; 
text-align: center;
margin: 0 auto 20px;
                  }
                  body {
                      background-color: #F5F5F5; /* Fondo gris claro para todo el cuerpo */
                      font-family: "Arial", sans-serif;
                      text-align: center; /* Texto centrado en todo el cuerpo */
                      padding: 20px; /* Espaciado interno */
                      margin: 0; /* Elimina los márgenes predeterminados del cuerpo */
                  }
                  h1 {
                      color: #333333; /* Texto oscuro */
                      font-size: 36px; /* Tamaño del texto del encabezado */
                      text-align: center;
                  }
                  p {
                      color: #333333; /* Texto oscuro */
                      font-size: 20px; /* Tamaño del texto del párrafo */
                      margin: 0 0 20px; /* Márgenes inferior para los párrafos */
                  }
                  #contenedor-encabezado {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 10px; /* Espaciado interno del encabezado */
                      margin-bottom: 20px; /* Márgenes inferiores para separar del resto del contenido */
                      margin-left: 42px;
                      margin-right: -2px;
                  }
                  #logo-izquierdo img,
                  #logo-derecho img {
                      width: 80px;
                      height: auto;
                      margin-right: 10px; /* Márgenes derechos para separar las imágenes del texto */
                  }
                  #texto-central {
                      text-align: center; 
                      color: #333333; /* Texto oscuro para el encabezado */
                  }
                  #texto-central h2,
                  #texto-central h3 {
                      margin: 0;
                      font-size: 24px; /* Tamaño del texto del encabezado secundario */
                  }
              </style>
          </head>
          <body>
              <div id="contenedor-encabezado">
                  <div id="logo-izquierdo">
                      <img
                      src="file://${path.join(__dirname, '../../../componentesFront/Login/images/logohd.png')}"
                      alt=""
                        width="80"
                        height="80"
                      />
                  </div>
                  <div id="texto-central">
                      <h2>PLATAFORMA Social</h2>
                      <h3>¡Blog</h3>
                  </div>
                  <div id="logo-derecho">
                      <img
                      src="file://${path.join(__dirname, '../../../componentesFront/Login/images/logohd.png')}"
                      alt="."
                        width="80"
                        height="64"
                      />
                  </div>
              </div>
                    <h1>Bienvenido a ¡Blog</h1>
              <p>Gracias por unirte a nuestra plataforma. Estamos emocionados de tenerte con nosotros.</p>
              
              <p>A continuación, encontrarás tu código de verificación:</p>
              
              <div class="codigo">${codigoVerificacion}</div>
              
              <p>Utiliza este código para acceder y disfrutar de nuestra plataforma</p>
      
            
              <p>¡Gracias nuevamente y feliz día!</p>
          </body>
      </html>`,
    });

    if (error) {
      console.error('Error al enviar el correo:', error);
      return null;
    }

    console.log('Correo enviado:', data);
    return codigoVerificacion;
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
    return null;
  }
}

module.exports = { sendEmail };
