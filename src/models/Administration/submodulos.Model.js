import pool from '../../database.js';

async function addSubmodulo(Data) {
  const conexion = await pool.connect();
  try {
    const { nombre, descripcion, ruta, estado, modulo_id } = Data;

    const existingDataQuery = ` SELECT id FROM administracion.submodulo WHERE nombre = $1 `;
    const existingDataResult = await conexion.query(existingDataQuery, [nombre]);
    if (existingDataResult.rows.length > 0) {
      return { error: 'Nombre de submodulo ya existe, por favor ingrese un nombre de submodulo diferente' };
    }
    await conexion.query('BEGIN');

    const query = ` INSERT INTO administracion.submodulo (nombre, descripcion, ruta, estado, modulo_id, fechacreacion) VALUES ($1, $2, $3, $4, $5, NOW()::timestamp(0)) RETURNING *; `;
    const result = await conexion.query(query, [nombre, descripcion, ruta, estado, modulo_id ]);

    await conexion.query('COMMIT');

    return { conexion: result.rows[0] };
  } catch (error) {
    await conexion.query('ROLLBACK');
    console.error('Error al insertar el submodulo:', error);
    throw error;
  } finally {
    conexion.release();
  }
}

export async function getAllSubmodulosModel() {
  const conexion = await pool.connect();
  console
  try {
    const query = `SELECT * FROM administracion.submodulo`;
    const resultado = await conexion.query(query);
    return resultado.rows;
  } finally {
    conexion.release();
  }
}

export const updatSubmodulo = async (SubmodulosId, updatedData) => {
  const { nombre, descripcion, ruta, estado, modulo_id } = updatedData;
  const conexion = await pool.connect();

  try {
    await conexion.query('BEGIN');
    const existingQuery = `SELECT id FROM administracion.submodulo WHERE id = $1`;
    const existingResult = await conexion.query(existingQuery, [SubmodulosId]);

    if (existingResult.rows.length === 0) {
      throw new Error('El submodulo no existe.');
    }
    const duplicateQuery = `SELECT id FROM administracion.submodulo WHERE nombre = $1 AND id <> $2`;
    const duplicateResult = await conexion.query(duplicateQuery, [nombre, SubmodulosId]);

    if (duplicateResult.rows.length > 0) {
      throw new Error('Nombre del submoulo ya existe, por favor ingrese un nombre de submodulo diferente');
    }
    const query = ` UPDATE administracion.submodulo  SET   nombre = $2,  descripcion = $3, ruta = $4, estado=$5 , modulo_id=$6, fechamodificacion= NOW()::timestamp(0)  WHERE id = $1 `;

    await conexion.query(query, [SubmodulosId, nombre, descripcion, ruta, estado, modulo_id]);

    await conexion.query('COMMIT');
    return { success: true };
  } catch (error) {
    await conexion.query('ROLLBACK');
    throw error;
  } finally {
    conexion.release();
  }
};

  export default {addSubmodulo, getAllSubmodulosModel,  updatSubmodulo }