const { generateVerificationCode, sendEmail } = require('./codContra');

module.exports.emailController = async (req, res) => {
  const { email } = req.body;

  try {
    const codigoVerificacion = generateVerificationCode();
    if (!codigoVerificacion) {
      throw new Error('No se pudo generar el código de verificación.');
    }

    const enviado = await sendEmail(codigoVerificacion, email);
    if (!enviado) {
      throw new Error('No se pudo enviar el correo de verificación.');
    }

    res.status(200).json({ success: true, message: 'Correo enviado', code: codigoVerificacion });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
