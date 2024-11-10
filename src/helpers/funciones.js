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


export default { isTokenExpired,  consultarClienteAPI }