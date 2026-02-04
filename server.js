const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Root Route (Health Check) - Para ver si el server vive
app.get('/', (req, res) => {
    res.send('<h1>¡Servidor de Kilote Funcionando! 🚀</h1><p>El backend está activo y escuchando.</p>');
});

// --- CONFIGURACIÓN DE CORREO ---
// REEMPLAZA ESTOS VALORES CON TU INFORMACIÓN REAL
const MY_EMAIL = 'neffarsebas@gmail.com';
// Eliminamos espacios en blanco por seguridad si se copiaron directo de Google
const MY_PASSWORD = 'vpgj vwzb ierw iwkr'.replace(/\s+/g, '');

// Middleware
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer JSON en el cuerpo de la petición
app.use(express.urlencoded({ extended: true }));

// Configurar el "Transportador" de Nodemailer
const transporter = nodemailer.createTransport({
    // ESTRATEGIA: CONEXIÓN EFÍMERA
    // En lugar de mantener la línea abierta, conectamos, enviamos y cerramos.
    pool: false,            // false = Conexión fresca por cada correo (Evita timeouts de idle)
    host: 'smtp.gmail.com',
    port: 465,              // Puerto SSL
    secure: true,           // SSL activado
    auth: {
        user: MY_EMAIL,
        pass: MY_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4,              // IPv4
    connectionTimeout: 10000 // 10s es suficiente para una conexión nueva
});

// Ruta para enviar correos
app.post('/send-email', async (req, res) => {
    const { name, email, phone, message } = req.body;

    console.log(`Intentando enviar correo para: ${name} (${email})`); // Log para depurar

    if (!name || !email || !phone) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos.' });
    }

    try {
        // 1. Correo para el DUEÑO
        const ownerMailOptions = {
            from: MY_EMAIL,
            to: MY_EMAIL,
            subject: `🔔 Nueva Reserva de ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-left: 5px solid #D4AF37; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">🔔 Nueva Reserva Recibida</h2>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <tr>
                                <td style="padding: 12px 0; color: #888; width: 100px; border-bottom: 1px solid #eee;"><strong>Cliente:</strong></td>
                                <td style="padding: 12px 0; color: #333; font-size: 16px; font-weight: bold; border-bottom: 1px solid #eee;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td>
                                <td style="padding: 12px 0; color: #333; font-size: 16px; border-bottom: 1px solid #eee;">${phone}</td>
                            </tr>
                             <tr>
                                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                                <td style="padding: 12px 0; color: #333; border-bottom: 1px solid #eee;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #888; vertical-align: top;"><strong>Mensaje:</strong></td>
                                <td style="padding: 12px 0; color: #555; line-height: 1.5;">${message || 'Sin mensaje adicional.'}</td>
                            </tr>
                        </table>

                        <div style="margin-top: 30px; text-align: right;">
                            <a href="mailto:${email}" style="background-color: #D4AF37; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Responder al Cliente</a>
                        </div>
                    </div>
                    <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">Sistema de Reservas - Kilote</p>
                </div>
            `
        };

        // 2. Correo para el CLIENTE
        const clientMailOptions = {
            from: `"Kilote Restaurant" <${MY_EMAIL}>`,
            to: email,
            subject: '✨ Confirmación de Recepción - Kilote',
            html: `
                <div style="background-color: #121212; font-family: 'Times New Roman', serif; padding: 40px 20px; text-align: center;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #1e1e1e; padding: 40px; border: 1px solid #333; border-radius: 8px;">
                        
                        <!-- Logo simulado o Texto -->
                        <h1 style="color: #D4AF37; font-size: 36px; margin: 0; letter-spacing: 2px;">KILOTE</h1>
                        <p style="color: #666; font-style: italic; margin-top: 5px; margin-bottom: 30px;">Arte & Sabor</p>
                        
                        <div style="width: 50px; height: 1px; background-color: #D4AF37; margin: 0 auto 30px;"></div>

                        <h2 style="color: #fff; font-weight: normal; margin-bottom: 20px;">¡Solicitud Recibida!</h2>
                        
                        <p style="color: #bbb; line-height: 1.6; font-size: 16px;">
                            Hola <strong>${name}</strong>,<br><br>
                            Gracias por elegirnos. Hemos recibido tu solicitud de reserva correctamente.
                            Nuestro equipo está verificando la disponibilidad para la fecha solicitada.
                        </p>

                        <div style="background-color: #252525; padding: 15px; margin: 30px 0; border-left: 3px solid #D4AF37; text-align: left;">
                            <p style="color: #888; margin: 0; font-size: 12px;">Tu mensaje:</p>
                            <p style="color: #ddd; margin: 5px 0; font-style: italic;">"${message || '...'}"</p>
                        </div>

                        <p style="color: #bbb; line-height: 1.6;">
                            Te enviaremos una confirmación definitiva muy pronto.
                        </p>

                        <div style="margin-top: 40px;">
                            <a href="#" style="color: #D4AF37; text-decoration: none; border-bottom: 1px solid #D4AF37; padding-bottom: 2px;">Volver al sitio web</a>
                        </div>
                    </div>
                    
                    <p style="color: #444; font-size: 12px; margin-top: 40px;">
                        Cl. 9 #6-14, Mocoa, Putumayo | Tel: 3164823442<br>
                        &copy; 2026 Kilote Restaurant
                    </p>
                </div>
            `
        };

        await Promise.all([
            transporter.sendMail(ownerMailOptions),
            transporter.sendMail(clientMailOptions)
        ]);

        console.log('¡Correos enviados con ÉXITO!');
        res.status(200).json({ success: true, message: 'Reserva enviada y correos despachados.' });

    } catch (error) {
        console.error('❌ ERROR CRÍTICO AL ENVIAR:', error);
        // Devolver el error EXACTO al frontend
        res.status(500).json({ success: false, message: `ERROR DEL SERVIDOR: ${error.message}` });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
    console.log(`Esperando peticiones POST en http://localhost:${PORT}/send-email`);
});
