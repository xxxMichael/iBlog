const { Resend } = require('resend');

const resend = new Resend('re_XKj47q8s_Lg9tQ3mLojXPQBHrsYaio2yK');

async function sendEmail(codigoVerificacion, recipientEmail) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [recipientEmail],
            subject: 'Código de Verificación',
            html: `<strong>Su código de verificación es: ${codigoVerificacion}</strong>`,
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
