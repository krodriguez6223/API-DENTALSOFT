import jwt from 'jsonwebtoken';
import pool from '../database.js';
import axios from 'axios';

//funcion para validar cuando el token ha expirado
export const isTokenExpired = (token) => {
  return new Promise(async (resolve, reject) => {
      try {
          const decoded = jwt.decode(token);
          if (!decoded || !decoded.exp) {
              resolve(true);
          } else {
              const expirationDate = new Date(decoded.exp * 1000); 
              const isExpired = expirationDate < new Date();
              resolve(isExpired);
          }
      } catch (error) {
          reject(error);
      }
  });
};

//funcion para validar cuando el numero de transacion de una transferencia esta duplicada
export async function existeNumTransaccion(numtransaccion) {
    const operacion = await pool.connect();
    try {
        const existeTransaccion = await operacion.query('SELECT id_operacion FROM operaciones WHERE numtransaccion = $1', [numtransaccion]);
        if (existeTransaccion.rows.length > 0) {
            return existeTransaccion.rows[0].id_operacion;
        } else {
            return null;
        }
    } finally {
        operacion.release();
    }
}

// En el modelo de entidad bancaria (por ejemplo)
export async function obtenerSobregiroPermitido(id_entidadbancaria) {
    const entidadBancariaQuery = await pool.query(`
      SELECT sobregiro FROM entidadbancaria WHERE id_entidadbancaria = $1`, [id_entidadbancaria]);
        if (entidadBancariaQuery.rows.length === 0) {
      return null; 
    }
    
    return entidadBancariaQuery.rows[0].sobregiro;
  }
export async function consultarClienteAPI(nident) {
    try {
        const response = await axios.post(
            'https://sacc.sistemascontrol.ec/api_control_identificaciones/public/data/consulta-identificacion',
            {
                "func": nident.length === 10 ? "GETCEDULA" : "GETRUC", "ruc": nident
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjMzMjMwMDM5MTc3LCJhdWQiOiJkMTM5MjhlYzAwMDg4Nzg0ZWMyOTA5MWNmMWM4OWJiN2JlMzAwOGE2IiwiZGF0YSI6eyJ1c3VhcmlvSWQiOiIxIiwibm9tYnJlIjoiQ09OVFJPTCJ9fQ.JcCt-17CJa8KZLWK1BzetcgReAksrlHFXoDug0fNaVk',
                    'Accept-X-Control-Y': 'controlsistemasjl.com'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error al consultar  datos del cliente:', error);
        throw error;
    }
}


export default { isTokenExpired, existeNumTransaccion, obtenerSobregiroPermitido, consultarClienteAPI }