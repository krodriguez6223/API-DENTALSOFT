import pool from '../../database.js';

async function addRoles(Data) {
  const rol = await pool.connect();
  try {
    const { nombre, estado } = Data;

    const existingDataQuery = ` SELECT id_rol FROM administracion.rol WHERE nombre = $1 `;
    const existingDataResult = await rol.query(existingDataQuery, [nombre]);
    if (existingDataResult.rows.length > 0) {
      return { error: 'Nombre de rol ya existe, por favor ingrese un nombre de rol diferente' };
    }
    await rol.query('BEGIN');

    const query = ` INSERT INTO administracion.rol (nombre, estado) VALUES ($1, $2 ) RETURNING *; `;
    const result = await rol.query(query, [nombre, estado]);

    await rol.query('COMMIT');

    return { rol: result.rows[0] };
  } catch (error) {
    await rol.query('ROLLBACK');
    console.error('Error al insertar el catálogo:', error);
    throw error;
  } finally {
    rol.release();
  }
}

export async function getAllRolesModel() {
  const roles = await pool.connect();
  console
  try {
    const query = `SELECT * FROM administracion.rol`;
    const resultado = await roles.query(query);
    return resultado.rows;
  } finally {
    roles.release();
  }
}


// funcion para obtener un catalogo por su ID
export const geRolesId = async (RolesId) => {
  /*try {
    const connection = await pool.connect();

    const query = `
     SELECT id, descripcion, estado, fechacreacion, fechamodificacion, usuariocreacion_id, usuariomodificacion_id
	   FROM administracion.catalogo
     WHERE id = $1;
    `;

    const result = await connection.query(query, [CatalogoId]);
    connection.release();

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el cliente por ID:', error);
    throw error;  // Lanza el error para que lo maneje el controlador
  }*/

};

export const updatRoles = async (RolesId, updatedData) => {
  const { nombre, estado } = updatedData;
  const rol = await pool.connect();

  try {
    await rol.query('BEGIN');
    // Verificar si el rol existe
    const existingQuery = `SELECT id_rol FROM administracion.rol WHERE id_rol = $1`;
    const existingResult = await rol.query(existingQuery, [RolesId]);
    if (existingResult.rows.length === 0) {
      throw new Error('El rol no existe.');
    }
    // Verificar si el nuevo nombre de rol ya está en uso por otro catálogo
    const duplicateQuery = `SELECT id_rol FROM administracion.rol WHERE nombre = $1 AND id_rol <> $2`;
    const duplicateResult = await rol.query(duplicateQuery, [nombre, RolesId]);
    if (duplicateResult.rows.length > 0) {
      throw new Error('Nombre de rol ya existe, por favor ingrese un nombre de rol diferente');
    }
    // Actualizar la tabla rol
    const query = ` UPDATE administracion.rol  SET   nombre = $2,  estado = $3  WHERE id_rol = $1 `;
    await rol.query(query, [RolesId, nombre, estado]);

    await rol.query('COMMIT');
    return { success: true };
  } catch (error) {
    await rol.query('ROLLBACK');
    throw error;
  } finally {
    rol.release();
  }
};

  export default {addRoles, getAllRolesModel, geRolesId, updatRoles }