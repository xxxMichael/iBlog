const { Resend } = require('resend');
const resend = new Resend('re_XKj47q8s_Lg9tQ3mLojXPQBHrsYaio2yK');

function generateVerificationCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function sendEmail(codigoVerificacion, recipientEmail) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'NotFairDev@iblog.click',
      to: [recipientEmail],
      subject: 'Recuperación de Contraseña',
      html: `  
      <html>
          <head>
              <style>
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
                      background-color: #F5F5F5;
                      font-family: "Arial", sans-serif;
                      text-align: center;
                      padding: 20px;
                      margin: 0;
                  }
                  h1 {
                      color: #333333;
                      font-size: 36px;
                      text-align: center;
                  }
                  p {
                      color: #333333;
                      font-size: 20px;
                      margin: 0 0 20px;
                  }
                  #contenedor-encabezado {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 10px;
                      margin-bottom: 20px;
                      margin-left: 42px;
                      margin-right: -2px;
                  }
                  #logo-izquierdo img,
                  #logo-derecho img {
                      width: 80px;
                      height: auto;
                      margin-right: 10px;
                  }
                  #texto-central {
                      text-align: center;
                      color: #333333;
                  }
                  #texto-central h2,
                  #texto-central h3 {
                      margin: 0;
                      font-size: 24px;
                  }
              </style>
          </head>
          <body>
              <div id="contenedor-encabezado">
                  <div id="logo-izquierdo">
                  <img
                  src="https://logopond.com/logos/422ac4960d4fe3bcd511d0b135d4bb6d.png"
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
                  src="https://logopond.com/logos/422ac4960d4fe3bcd511d0b135d4bb6d.png"
                  alt=""
                  width="80"
                  height="80"
              />
                  </div>
              </div>
                    <h1>Recuperación de Contraseña</h1>
              <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no solicitaste este cambio, por favor ignora este correo.</p>
              
              <p>A continuación, encontrarás tu código de verificación:</p>
              
              <div class="codigo">${codigoVerificacion}</div>
              
              <p>Utiliza este código para recuperar tu contraseña en nuestra plataforma.</p>
      
            
              <p>¡Gracias y feliz día!</p>
          </body>
      </html>`,
    });

    if (error) {
      console.error('Error al enviar el correo:', error);
      return false;
    }

    console.log('Correo enviado:', data);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
    return false;
  }
}

module.exports = { generateVerificationCode, sendEmail };
