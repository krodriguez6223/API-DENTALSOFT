import pool from '../../database.js';

async function addPermisos(Data) {
  const conexion = await pool.connect();
  try {
    const { nombre, estado } = Data;

    const existingDataQuery = ` SELECT id  FROM administracion.permiso WHERE nombre = $1 `;
    const existingDataResult = await conexion.query(existingDataQuery, [nombre]);
    if (existingDataResult.rows.length > 0) {
      return { error: 'Nombre de permiso ya existe, por favor ingrese un nombre de permiso diferente' };
    }
    await conexion.query('BEGIN');

    const query = ` INSERT INTO administracion.permiso (nombre, estado) VALUES ($1, $2 ) RETURNING *; `;
    const result = await rol.query(query, [nombre, estado]);

    await conexion.query('COMMIT');

    return { rol: result.rows[0] };
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
    const query = `SELECT * FROM administracion.permiso`;
    const resultado = await conexion.query(query);
    return resultado.rows;
  } finally {
    conexion.release();
  }
}


export const getPermisoId = async (PermisoId) => {
  try {
    const conexion = await pool.connect();

    const query = `
     SELECT id, descripcion, estado, fechacreacion, fechamodificacion, usuariocreacion_id, usuariomodificacion_id
	   FROM administracion.permiso
     WHERE id = $1;
    `;

    const result = await conexion.query(query, [PermisoId]);
    conexion.release();

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el permiso por ID:', error);
    throw error;  
  }

};

export const updatPermiso= async (PermisoId, updatedData) => {
  const { nombre, estado } = updatedData;
  const conexion = await pool.connect();

  try {
    await conexion.query('BEGIN');

    const existingQuery = `SELECT id FROM administracion.permiso WHERE id = $1`;
    const existingResult = await rol.query(existingQuery, [RolesId]);
    if (existingResult.rows.length === 0) {
      throw new Error('El permiso no existe.');
    }

    const duplicateQuery = `SELECT id FROM administracion.permiso WHERE nombre = $1 AND id_rol <> $2`;
    const duplicateResult = await rol.query(duplicateQuery, [nombre, RolesId]);
    if (duplicateResult.rows.length > 0) {
      throw new Error('Nombre de permiso ya existe, por favor ingrese un nombre de permiso diferente');
    }

    const query = ` UPDATE administracion.permiso  SET   nombre = $2,  estado = $3  WHERE id_rol = $1 `;
    await conexion.query(query, [PermisoId, nombre, estado]);

    await conexion.query('COMMIT');
    return { success: true };
  } catch (error) {
    await conexion.query('ROLLBACK');
    throw error;
  } finally {
    conexion.release();
  }
};

  export default {addPermisos, getAllPermisosModel, getPermisoId, updatPermiso }