// ruta_usuario.js
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
});

router.post('/', async (req, res) => {
    try {
        const { Nombre, Edad, JuegoFavorito } = req.body;
        Edad = Edad.toString();
        // Verificar que los campos no estén vacíos o nulos
        if (!Nombre || Nombre.trim() === '' || !Edad || Edad.trim() === '' || !JuegoFavorito || JuegoFavorito.trim() === '') {
            return res.status(400).json({ mensaje: "Los campos no pueden estar vacíos o nulos" });
        }
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('INSERT INTO usuarios (nombre, edad, juegoFavorito) VALUES (?, ?, ?)', [Nombre, Edad, JuegoFavorito]);
            if (rows.affectedRows === 1) {
                res.status(200).json({ mensaje: "Información agregada correctamente" });
            } else {
                res.status(400).json({ mensaje: "Error al agregar la información" });
            }
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (error) {
        console.error("Error de conexión:", error.message);
        res.status(500).json({ mensaje: "Error de conexión" });
    }
});

router.put('/:nombre', async (req, res) => {
    try {
        const { NuevoJuegoFavorito } = req.body;
        const { nombre } = req.params;
        // Verificar que el nuevo juego favorito no esté vacío o nulo
        if (!NuevoJuegoFavorito || NuevoJuegoFavorito.trim() === '') {
            return res.status(400).json({ mensaje: "El nuevo juego favorito no puede estar vacío o nulo" });
        }
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('UPDATE usuarios SET juegoFavorito = ? WHERE nombre = ?', [NuevoJuegoFavorito, nombre]);

            if (result.affectedRows > 0) {
                res.status(200).json({ mensaje: "Información actualizada correctamente" });
            } else {
                res.status(404).json({ mensaje: "No se encontró información con el nombre proporcionado" });
            }
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (error) {
        console.error("Error de conexión:", error.message);
        res.status(500).json({ mensaje: "Error de conexión" });
    }
});

router.delete('/', async (req, res) => {
    try {
        const { Edad } = req.body;
        // Verificar que la edad no esté vacía o nula
        if (!Edad || Edad.trim() === '') {
            return res.status(400).json({ mensaje: "La edad no puede estar vacía o nula" });
        }
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('DELETE FROM usuarios WHERE edad = ?', [Edad]);

            if (result.affectedRows > 0) {
                res.status(200).json({ mensaje: "Información eliminada correctamente" });
            } else {
                res.status(404).json({ mensaje: "No se encontró información con la edad proporcionada" });
            }
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (error) {
        console.error("Error de conexión:", error.message);
        res.status(500).json({ mensaje: "Error de conexión" });
    }
});


export { router }; // Named export