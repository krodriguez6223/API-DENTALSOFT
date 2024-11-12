
import pool from '../database.js'

const permissionActions = {
    'GET': 'read',
    'POST': 'create',
    'PUT': 'update',
    'DELETE': 'delete',
    'EXPORT': 'export',
    'PRINT': 'print'
};

export const checkPermissions = (modulePath, submodulePath = null) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            const action = permissionActions[req.method];
            
            if (!action) {
                return res.status(405).json({ message: 'Método no permitido' });
            }
            // Consulta para verificar los permisos del usuario en módulo o submódulo
            let query = `
                SELECT p.*
                FROM administracion.permisos AS p
                LEFT JOIN administracion.submodulo AS s ON s.id = p.id_permiso
                LEFT JOIN administracion.modulo AS m ON m.id = s.id
                WHERE p.id_usuario = $1
                AND p.ruta = $2
                AND m.ruta = $3
                ${submodulePath ? 'AND s.ruta = $4' : ''}
            `;

            const params = submodulePath
                ? [userId, req.originalUrl, modulePath, submodulePath]
                : [userId, req.originalUrl, modulePath];

            const result = await pool.query(query, params);

            // Verificar que haya un registro con el permiso específico en true
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

