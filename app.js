// app.js
import express from 'express';
import { PORT } from './config.js';
import bodyParser from 'body-parser';
import { router as rutaUsuarioRouter } from './routes/ruta_usuario.js';

const app = express();

app.use(bodyParser.json());
// Rutas de usuarios
app.use('/usuarios', rutaUsuarioRouter);

app.listen(PORT);
console.log('Server on port', PORT);
