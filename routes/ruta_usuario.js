// ruta_usuario.js
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     description: Obtiene todos los usuarios.
 *     responses:
 *       200:
 *         description: Se obtienen los usuarios con éxito.
 */
router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     description: Crea un nuevo usuario.
 *     parameters:
 *       - in: body
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: El nombre del usuario.
 *       - in: body
 *         name: edad
 *         required: true
 *         schema:
 *           type: integer
 *         description: La edad del usuario.
 *       - in: body
 *         name: juegoFavorito
 *         required: true
 *         schema:
 *           type: string
 *         description: El juego favorito del usuario.
 *     responses:
 *       200:
 *         description: Información agregada correctamente.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Ejemplo de respuesta exitosa
 *                 value:
 *                   mensaje: Usuario creado correctamente
 *       400:
 *         description: Error al agregar la información o campos vacíos/nulos.
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de respuesta de error
 *                 value:
 *                   mensaje: Error al agregar el usuario
 */
router.post('/', async (req, res) => {
    try {
        const { Nombre, Edad, JuegoFavorito } = req.body;
        const EdadConvertida = Edad.toString();
        // Verificar que los campos no estén vacíos o nulos
        if (!Nombre || Nombre.trim() === '' || !EdadConvertida || EdadConvertida.trim() === '' || !JuegoFavorito || JuegoFavorito.trim() === '') {
            return res.status(400).json({ mensaje: "Los campos no pueden estar vacíos o nulos" });
        }
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('INSERT INTO usuarios (Nombre, Edad, JuegoFavorito) VALUES (?, ?, ?)', [Nombre, EdadConvertida, JuegoFavorito]);
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

/**
 * @swagger
 * /usuarios/{nombre}:
 *   put:
 *     summary: Actualiza el juego favorito de un usuario por su nombre.
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: El nombre del usuario a actualizar.
 *       - in: body
 *         name: body
 *         required: true
 *         description: Objeto con el nuevo juego favorito.
 *         schema:
 *           type: object
 *           properties:
 *             nuevoJuegoFavorito:
 *               type: string
 *           example:
 *             nuevoJuegoFavorito: "Nuevo Juego"
 *     responses:
 *       200:
 *         description: Información actualizada correctamente.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Ejemplo de actualización exitosa
 *                 value:
 *                   mensaje: Información actualizada correctamente
 *       404:
 *         description: No se encontró información con el nombre proporcionado.
 *         content:
 *           application/json:
 *             examples:
 *               notFound:
 *                 summary: Ejemplo de respuesta cuando no se encuentra el usuario
 *                 value:
 *                   mensaje: No se encontró usuario con el nombre proporcionado
 *       400:
 *         description: El nuevo juego favorito no puede estar vacío o nulo.
 *         content:
 *           application/json:
 *             examples:
 *               badRequest:
 *                 summary: Ejemplo de solicitud incorrecta
 *                 value:
 *                   mensaje: El nuevo juego favorito no puede estar vacío o nulo
 *       500:
 *         description: Error de conexión.
 *         content:
 *           application/json:
 *             examples:
 *               serverError:
 *                 summary: Ejemplo de error del servidor
 *                 value:
 *                   mensaje: Error del servidor al intentar actualizar el usuario
 */
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
            const [result] = await connection.query('UPDATE usuarios SET JuegoFavorito = ? WHERE Nombre = ?', [NuevoJuegoFavorito, nombre]);

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

/**
 * @swagger
 * /usuarios:
 *   delete:
 *     description: Elimina usuario basados en el ID.
 *     parameters:
 *       - in: body
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El id del usuario a eliminar.
 *     responses:
 *       200:
 *         description: Información eliminada correctamente.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Ejemplo de eliminación exitosa
 *                 value:
 *                   mensaje: Usuario eliminado correctamente
 *       404:
 *         description: No se encontró información con la edad proporcionada.
 *         content:
 *           application/json:
 *             examples:
 *               notFound:
 *                 summary: Ejemplo de respuesta cuando no se encuentra el usuario
 *                 value:
 *                   mensaje: No se encontró usuario con el ID proporcionado
 *       400:
 *         description: La edad no puede estar vacía o nula.
 *         content:
 *           application/json:
 *             examples:
 *               badRequest:
 *                 summary: Ejemplo de solicitud incorrecta
 *                 value:
 *                   mensaje: Error en la solicitud, ID no proporcionado correctamente
 *       500:
 *         description: Error de conexión.
 *         content:
 *           application/json:
 *             examples:
 *               serverError:
 *                 summary: Ejemplo de error del servidor
 *                 value:
 *                   mensaje: Error del servidor al intentar eliminar el usuario
 */
router.delete('/', async (req, res) => {
    try {
        const { id } = req.body;

        // Verificar que el ID no esté vacío o nulo
        if (!id || id.trim() === '') {
            return res.status(400).json({ mensaje: "El ID no puede estar vacío o nulo" });
        }

        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);

            if (result.affectedRows > 0) {
                res.status(200).json({ mensaje: "Información eliminada correctamente" });
            } else {
                res.status(404).json({ mensaje: "No se encontró información con el ID proporcionado" });
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