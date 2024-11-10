import pool from '../../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config.js';


// Función para agregar un nuevo catalogo
async function addCatalogo(catalogoData) {
  const catalogo = await pool.connect();
  try {
    const { descripcion, estado } = catalogoData;

    const existingCatalogoQuery = ` SELECT id FROM administracion.catalogo WHERE descripcion = $1 `;
    const existingCatalogoResult = await catalogo.query(existingCatalogoQuery, [descripcion]);
    if (existingCatalogoResult.rows.length > 0) {
      return { error: 'Nombre de catálogo ya existe, por favor ingrese un nombre de catálogo diferente' };
    }
    await catalogo.query('BEGIN');

    const catalogoInsertQuery = ` INSERT INTO administracion.catalogo (descripcion, estado, fechacreacion) VALUES ($1, $2, NOW()) RETURNING *; `;
    const catalogoInsertResult = await catalogo.query(catalogoInsertQuery, [descripcion, estado]);

    await catalogo.query('COMMIT');

    return { catalogo: catalogoInsertResult.rows[0] };
  } catch (error) {
    await catalogo.query('ROLLBACK');
    console.error('Error al insertar el catálogo:', error);
    throw error;
  } finally {
    catalogo.release();
  }
}



async function getAllCatalogo() {
  const catalogo = await pool.connect();
  try {
    const resultado = await catalogo.query(` SELECT id, descripcion, estado, fechacreacion FROM administracion.catalogo; `);
    return resultado.rows;
  } finally {
    catalogo.release()
  }

}

// funcion para obtener un catalogo por su ID
export const getCatalogoId = async (CatalogoId) => {
  try {
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
  }

};

export const updateCatalogo = async (CatalogoId, updatedData) => {
  const { descripcion, estado } = updatedData;
  const catalogo = await pool.connect();

  try {
    await catalogo.query('BEGIN');
    // Verificar si el catálogo existe
    const existingCatalogoQuery = `SELECT id FROM administracion.catalogo WHERE id = $1`;
    const existingCatalogoResult = await catalogo.query(existingCatalogoQuery, [CatalogoId]);
    if (existingCatalogoResult.rows.length === 0) {
      throw new Error('El catalogo no existe.');
    }
    // Verificar si el nuevo nombre de catálogo ya está en uso por otro catálogo
    const duplicateCatalogoQuery = `SELECT id FROM administracion.catalogo WHERE descripcion = $1 AND id <> $2`;
    const duplicateCatalogoResult = await catalogo.query(duplicateCatalogoQuery, [descripcion, CatalogoId]);
    if (duplicateCatalogoResult.rows.length > 0) {
      throw new Error('Nombre de catálogo ya existe, por favor ingrese un nombre de catálogo diferente');
    }
    // Actualizar la tabla catalogo
    const catalogoQuery = ` UPDATE administracion.catalogo  SET   descripcion = $2,  estado = $3  WHERE id = $1 `;
    await catalogo.query(catalogoQuery, [CatalogoId, descripcion, estado]);

    await catalogo.query('COMMIT');
    return { success: true };
  } catch (error) {
    await catalogo.query('ROLLBACK');
    throw error;
  } finally {
    catalogo.release();
  }
};

// Función para agregar un nuevo catalogo
async function addDetCatalogo(catalogoData) {
  const catalogoDet = await pool.connect();
  try {
    const { catalogo_id, descripcion, valor, estado } = catalogoData;

    const existingCatalogoQuery = ` SELECT id FROM administracion.detallecatalogo WHERE descripcion = $1 `;
    const existingCatalogoResult = await catalogoDet.query(existingCatalogoQuery, [descripcion]);
    if (existingCatalogoResult.rows.length > 0) {
      return { error: 'Nombre de detalle catálogo ya existe, por favor ingrese un nombre de catálogo diferente' };
    }
    await catalogoDet.query('BEGIN');

    const catalogoInsertQuery = ` INSERT INTO administracion.detallecatalogo (catalogo_id, descripcion, valor, estado, fechacreacion) VALUES ($1, $2, $3, $4, NOW()) RETURNING *; `;
    const catalogoInsertResult = await catalogoDet.query(catalogoInsertQuery, [catalogo_id, descripcion, valor, estado]);

    await catalogoDet.query('COMMIT');

    return { catalogoDet: catalogoInsertResult.rows[0] };
  } catch (error) {
    await catalogoDet.query('ROLLBACK');
    console.error('Error al insertar el catálogo:', error);
    throw error;
  } finally {
    catalogoDet.release();
  }
}

//Funcion para obtener todos los catalogo
async function getAllDetCatalogo() {
  const catalogoDet = await pool.connect();
  try {
    const resultado = await
      catalogoDet.query(` SELECT 
                        det.id, 
                        det.descripcion, 
                        det.valor, 
                        det.detallecatalogo_id, 
                        det.estado, 
                        det.fechacreacion, 
                        det.fechamodificacion,
                        det.catalogo_id,
                        c.descripcion as descripcion_catalogo
                        
                        FROM administracion.detallecatalogo det
                        JOIN administracion.catalogo c ON c.id = det.catalogo_id`);
    return resultado.rows;
  } finally {
    catalogoDet.release()
  }
}

// funcion para obtener un catalogo por su ID
export const getDetCatalogoId = async (CatalogoId) => {
  try {
    const connection = await pool.connect();
    const query = `
                  SELECT 
                        det.id, 
                        det.descripcion, 
                        det.valor, 
                        det.detallecatalogo_id, 
                        det.estado, 
                        det.fechacreacion, 
                        det.fechamodificacion,
                        det.catalogo_id,
                        c.descripcion as descripcion_catalogo
                        
                        FROM administracion.detallecatalogo det
                        JOIN administracion.catalogo c ON c.id = det.catalogo_id
                  WHERE det.id = $1;
                 `;
    const result = await connection.query(query, [CatalogoId]);
    connection.release();

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el cliente por ID:', error);
    throw error;
  }

};

export const updateDetCatalogo = async (detCatalogoId, updatedData) => {
  const { catalogo_id, descripcion, valor, estado } = updatedData;
  const detcatalogo = await pool.connect();

  try {
    await detcatalogo.query('BEGIN');
   // Verificar si el catálogo existe
    const existingCatalogoQuery = `SELECT id FROM administracion.detallecatalogo WHERE id = $1`;
    const existingCatalogoResult = await detcatalogo.query(existingCatalogoQuery, [detCatalogoId]);
    if (existingCatalogoResult.rows.length === 0) {
      throw new Error('El catalogo no existe.');
    }
    // Verificar si el nuevo nombre de catálogo ya está en uso por otro catálogo
    const duplicateCatalogoQuery = `SELECT id FROM administracion.detallecatalogo WHERE descripcion = $1 AND id <> $2`;
    const duplicateCatalogoResult = await detcatalogo.query(duplicateCatalogoQuery, [descripcion, detCatalogoId]);
    if (duplicateCatalogoResult.rows.length > 0) {
      throw new Error('Nombre de catálogo ya existe, por favor ingrese un nombre de catálogo diferente');
    }
    // Actualizar la tabla catalogo
    const catalogoQuery = ` UPDATE administracion.detallecatalogo  SET  catalogo_id = $2, descripcion = $3,  valor= $4,  estado = $5  WHERE id = $1 `;
    await detcatalogo.query(catalogoQuery, [detCatalogoId, catalogo_id, descripcion, valor, estado]);

    await detcatalogo.query('COMMIT');
    return { success: true };
  } catch (error) {
    await detcatalogo.query('ROLLBACK');
    throw error;
  } finally {
    detcatalogo.release();
  }
};


// Exportar las funciones del modelo
export default {
  addCatalogo,
  getAllCatalogo,
  getCatalogoId,
  updateCatalogo,
  addDetCatalogo,
  getAllDetCatalogo,
  getDetCatalogoId,
  updateDetCatalogo,
};