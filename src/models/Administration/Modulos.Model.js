import pool from '../../database.js';

async function addModulos(Data) {
  const conexion = await pool.connect();
  try {
    const { nombre, descripcion, ruta, estado } = Data;

    const existingDataQuery = ` SELECT id FROM administracion.modulo WHERE nombre = $1 `;
    const existingDataResult = await conexion.query(existingDataQuery, [nombre]);
    if (existingDataResult.rows.length > 0) {
      return { error: 'Nombre de modulo ya existe, por favor ingrese un nombre de modulo diferente' };
    }
    await conexion.query('BEGIN');

    const query = ` INSERT INTO administracion.modulo (nombre, descripcion, ruta, estado, fechacreacion) VALUES ($1, $2, $3, $4, NOW()::timestamp(0)) RETURNING *; `;
    const result = await conexion.query(query, [nombre, descripcion, ruta, estado ]);

    await conexion.query('COMMIT');

    return { conexion: result.rows[0] };
  } catch (error) {
    await conexion.query('ROLLBACK');
    console.error('Error al insertar el modulo:', error);
    throw error;
  } finally {
    conexion.release();
  }
}

export async function getAllModulosModel() {
  const conexion = await pool.connect();
  console
  try {
    const query = `SELECT * FROM administracion.modulo`;
    const resultado = await conexion.query(query);
    return resultado.rows;
  } finally {
    conexion.release();
  }
}

export const updatModulo = async (ModulosId, updatedData) => {
  const { nombre, descripcion, ruta, estado } = updatedData;
  const conexion = await pool.connect();

  try {
    await conexion.query('BEGIN');
    const existingQuery = `SELECT id FROM administracion.modulo WHERE id = $1`;
    const existingResult = await conexion.query(existingQuery, [ModulosId]);

    if (existingResult.rows.length === 0) {
      throw new Error('El modulo no existe.');
    }
    const duplicateQuery = `SELECT id FROM administracion.modulo WHERE nombre = $1 AND id <> $2`;
    const duplicateResult = await conexion.query(duplicateQuery, [nombre, ModulosId]);

    if (duplicateResult.rows.length > 0) {
      throw new Error('Nombre del modulo ya existe, por favor ingrese un nombre de modulo diferente');
    }
    const query = ` UPDATE administracion.modulo  SET   nombre = $2,  descripcion = $3, ruta = $4, estado=$5 , fechamodificacion= NOW()::timestamp(0)  WHERE id = $1 `;

    await conexion.query(query, [ModulosId, nombre, descripcion, ruta, estado]);

    await conexion.query('COMMIT');
    return { success: true };
  } catch (error) {
    await conexion.query('ROLLBACK');
    throw error;
  } finally {
    conexion.release();
  }
};

  export default {addModulos, getAllModulosModel,  updatModulo }