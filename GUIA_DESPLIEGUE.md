# Guía de Despliegue: Backend en Render + Frontend en Surge

Para que tu sistema funcione al 100% en internet ("Sin Errores"), necesitamos separar las cosas:
1.  **Frontend (Surge):** Solo sabe mostrar la página (HTML/CSS).
2.  **Backend (Render):** Es el cerebro que envía los correos (Node.js).

Sigue estos pasos EXACTOS:

## PASO 1: Subir el Backend a Render (Gratis)
Surge NO ejecuta Node.js. Usaremos Render.com.

1.  Crea una cuenta en [Render.com](https://render.com/).
2.  Sube tu carpeta del proyecto a **GitHub** (Render necesita leer el código de ahí).
3.  En Render, crea un **"New Web Service"**.
4.  Conecta tu repositorio de GitHub.
5.  Configura esto:
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
6.  Dale a **Deploy**.

Render te dará una URL (ejemplo: `https://kilote-backend.onrender.com`). **CÓPIALA.**

## PASO 2: Conectar Frontend y Backend
1.  Abre tu archivo `script.js` en tu PC.
2.  Busca la línea donde dice:
    ```javascript
    const API_URL = 'http://localhost:3000/send-email';
    ```
3.  Cámbiala por tu nueva URL de Render:
    ```javascript
    const API_URL = 'https://kilote-backend.onrender.com/send-email';
    ```

## PASO 3: Subir a Surge
Ahora sí, sube tu frontend terminado a Surge:

```bash
surge
```

¡Listo! Ahora tu página en Surge se conectará con el servidor en Render y enviará los correos perfectamente.
