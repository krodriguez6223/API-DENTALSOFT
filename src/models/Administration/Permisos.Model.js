import pool from '../../database.js';

async function addPermisos(Data) {
  const conexion = await pool.connect();
  try {
    const { id_rol, entidad, id_modulo, created, read, updatePerm, deletePerm, exportPerm, printPerm } = Data;

    const existingDataQuery = ` SELECT id_permiso  FROM administracion.permisos WHERE entidad = $1 `;
    const existingDataResult = await conexion.query(existingDataQuery, [entidad]);
    if (existingDataResult.rows.length > 0) {
      return { error: 'Nombre de permiso ya existe, por favor ingrese un nombre de permiso diferente' };
    }
    await conexion.query('BEGIN');

    const query = ` INSERT INTO administracion.permisos (id_rol, entidad, id_modulo, created, read, update, delete, export, print, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()::timestamp(0)) RETURNING *; `;
    const result = await conexion.query(query, [id_rol, entidad, id_modulo, created, read, updatePerm, deletePerm, exportPerm, printPerm]);

    await conexion.query('COMMIT');

    return { conexion: result.rows[0] };
  } catch (error) {
    await conexion.query('ROLLBACK');
    console.error('Error al insertar el permiso:', error);
    throw error;
  } finally {
    conexion.release();
  }
}

export async function getAllPermisosModel() {
  const conexion = await pool.connect();
  console
  try {
    const query = `SELECT * FROM administracion.permisos`;
    const resultado = await conexion.query(query);
    return resultado.rows;
  } finally {
    conexion.release();
  }
}

// trae todos los permisos de un usuario
export const getPermisoId = async (PermisoId) => {
  try {
    const conexion = await pool.connect();

    const query = `
     	 SELECT p.*
	     FROM administracion.permisos AS p
       INNER JOIN administracion.rol AS r ON r.id_rol = p.id_rol
       INNER JOIN administracion.usuario_rol AS ur ON ur.id_rol = r.id_rol
       INNER JOIN administracion.usuario AS u ON u.id_usuario = ur.id_usuario
       WHERE u.id_usuario = $1
    `;

    const result = await conexion.query(query, [PermisoId]);
    conexion.release();

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  } catch (error) {
    console.error('Error al obtener el permiso por ID:', error);
    throw error;
  }

};

export const updatPermiso = async (PermisoId, updatedData) => {
  const { id_rol, entidad, id_modulo, created, read, updatePerm, deletePerm, exportPerm, printPerm } = updatedData;
  const conexion = await pool.connect();

  try {
    await conexion.query('BEGIN');

    const existingQuery = `SELECT id_permiso FROM administracion.permisos WHERE id_permiso = $1`;
    const existingResult = await conexion.query(existingQuery, [PermisoId]);
    if (existingResult.rows.length === 0) {
      throw new Error('El permiso no existe.');
    }

    const duplicateQuery = `SELECT id_permiso FROM administracion.permisos WHERE entidad = $1 AND id_permiso <> $2`;
    const duplicateResult = await conexion.query(duplicateQuery, [entidad, PermisoId]);
    if (duplicateResult.rows.length > 0) {
      throw new Error('Nombre de permiso ya existe, por favor ingrese un nombre de permiso diferente');
    }

    const query = ` UPDATE administracion.permisos  SET   id_rol = $2, entidad = $3, id_modulo=$4, created=$5, read=$6, update=$7, delete=$8, export=$9, print=$10  WHERE id_permiso = $1 `;
    await conexion.query(query, [PermisoId, id_rol, entidad, id_modulo, created, read, updatePerm, deletePerm, exportPerm, printPerm]);

    await conexion.query('COMMIT');
    return { success: true };
  } catch (error) {
    await conexion.query('ROLLBACK');
    throw error;
  } finally {
    conexion.release();
  }
};

export default { addPermisos, getAllPermisosModel, getPermisoId, updatPermiso }