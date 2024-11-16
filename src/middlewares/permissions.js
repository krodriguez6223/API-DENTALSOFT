
import pool from '../database.js'
import jwt from 'jsonwebtoken';
import config from '../config.js';

const permissionActions = {
    'GET': 'read',
    'POST': 'created',
    'PUT': 'update',
    'DELETE': 'delete',
    'EXPORT': 'export',
    'PRINT': 'print'
};

export const checkPermissions = (subModulePath, idSubmodulo) => {
    return async (req, res, next) => {
        try {
            const token = req.headers["x-access-token"];
            const decoded = jwt.verify(token, config.SECRET);
            const userId = decoded.userId;
            const action = permissionActions[req.method];
            if (!action) {
                return res.status(405).json({ message: 'Método no permitido' });
            }
            let query = `
                SELECT p.*
                FROM administracion.permisos AS p
                INNER JOIN administracion.rol AS r ON r.id_rol = p.id_rol
                INNER JOIN administracion.usuario_rol AS ur ON ur.id_rol = r.id_rol
                INNER JOIN administracion.usuario AS u ON u.id_usuario = ur.id_usuario
                LEFT JOIN administracion.submodulo AS s ON s.id = p.id_submodulo
                WHERE u.id_usuario = $1
                AND S.estado = true
                AND s.ruta = $2
                AND s.id = $3
            `;
            const params = [userId, subModulePath, idSubmodulo];
            const result = await pool.query(query, params);

            if (!result.rows.length || !result.rows[0][action]) {
                return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al verificar permisos' });
        }
    };
};




export default { checkPermissions }

