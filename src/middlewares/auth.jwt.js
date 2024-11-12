
import pool from '../database.js';
import config from '../config.js';
import jwt from 'jsonwebtoken';
import { isTokenExpired } from '../helpers/funciones.js'

export const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ message: "No token provided" });
    try {
        const isExpired = await isTokenExpired(token);
        if (isExpired) {
            return res.status(401).json({ message: 'Token ha caducado' });
        }
        const decoded = jwt.verify(token, config.SECRET);
        const { rows } = await pool.query('SELECT * FROM administracion.usuario WHERE id_usuario = $1', [decoded.userId]);

        if (!rows[0]) return res.status(404).json({ message: 'Usuario no encontrado' });
        req.user = rows[0]; 
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(401).json({ message: 'Token inválido' });
    }
};



export default { verifyToken }

