// app.js
import express from 'express';
import { PORT } from './config.js';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';

import { router as rutaUsuarioRouter } from './routes/ruta_usuario.js';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const app = express();

import { SwaggerTheme } from 'swagger-themes';

const theme = new SwaggerTheme('v3'); 
const styleTheme = theme.getBuffer('dark'); 

// Middleware para Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'API Usuarios',
            version: '1.0.0',
        },
        servers: [
            { url: "https://api-production-e36c.up.railway.app" }
        ],
        tags: [ 
            { name: 'default', description: 'Operaciones relacionadas con usuarios' },
        ],
    },
    apis: [`${path.join(__dirname, './routes/ruta_usuario.js')}`],
    explorer: true,
    customCss: styleTheme
};
// Cambia la importación de 'swagger-jsdoc'
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, swaggerOptions));
app.use(bodyParser.json());

// Rutas de usuarios
app.use('/usuarios', rutaUsuarioRouter);

app.listen(PORT);
console.log('Server on port', PORT);