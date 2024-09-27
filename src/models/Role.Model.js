import pool from '../database.js';


//Obtener todas las cajas / activas e inactivas
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

  export default { getAllRolesModel }