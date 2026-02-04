const nodemailer = require('nodemailer');

const MY_EMAIL = 'neffarsebas@gmail.com';
// La contraseña que estaba en server.js
const MY_PASSWORD = 'vpgj vwzb ierw iwkr'.replace(/\s+/g, '');

console.log('--- DIAGNÓSTICO DE CREDENCIALES ---');
console.log(`Email configurado: ${MY_EMAIL}`);
console.log(`Longitud contraseña: ${MY_PASSWORD.length} caracteres (deberían ser 16)`);
console.log('Intentando conectar con Google...');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MY_EMAIL,
        pass: MY_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log('❌ ERROR DE CONEXIÓN:');
        console.log(error);
        if (error.responseCode === 535) {
            console.log('\n--> CONCLUSIÓN: Google rechaza la contraseña.');
            console.log('    1. Asegúrate de que la Contraseña de Aplicación sigue activa.');
            console.log('    2. Asegúrate de que tu correo neffarseba@gmail.com es correcto.');
            console.log('    3. Genera una NUEVA contraseña de aplicación e inténtalo de nuevo.');
        }
    } else {
        console.log('✅ CONEXIÓN EXITOSA: El servidor está listo para enviar correos.');
    }
});
