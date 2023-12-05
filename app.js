import express from 'express';
import bodyParser from 'body-parser';
import { config as dotenvConfig } from 'dotenv'; // Importa el método 'config' desde 'dotenv'
import { PORT } from './config.js';
import { router as rutaUsuarioRouter } from './routes/ruta_usuario.js';

// Carga las variables de entorno desde el archivo .env
dotenvConfig();

const app = express();

app.use(bodyParser.json());
// Rutas de usuarios
app.use('/usuarios', rutaUsuarioRouter);

app.listen(PORT);
console.log('Server on port', PORT);
