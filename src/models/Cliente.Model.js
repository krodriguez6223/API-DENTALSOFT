import pool from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';


async function addCliente(Persona, Cliente) {

  const user = await pool.connect();
  try {
    const { nombre, 
          apellido, 
          fecha_nacimiento, 
          direccion, 
          telefono, 
          cedula, 
          correopersonal, 
          correoinstitucional, 
          observacion, 
          cat_tipoidentificacion_id, 
          cat_estadocivil, 
          cat_ciudad, 
          cat_pais,
          cat_sexo, 
          cat_provincia
          } = Persona;
    const { estado } = Cliente;

    // Verificar si la cédula ya está registrada
    const existingCedulaQuery = `
      SELECT id_persona
      FROM administracion.persona
      WHERE cedula = $1
    `;
    const existingCedulaResult = await user.query(existingCedulaQuery, [cedula]);
    if (existingCedulaResult.rows.length > 0) {
      return { error: 'Cédula ya registrada, la cédula ya pertenece a un cliente registrado.' };
    }

    await user.query('BEGIN');

    // Insertar en la tabla 'persona'
    const personaInsertResult = await user.query(`
    INSERT INTO administracion.persona
      (nombre, 
      apellido, 
      fecha_nacimiento, 
      direccion, 
      telefono, 
      cedula, 
      correopersonal, 
      correoinstitucional, 
      observacion, 
      estado, 
      cat_tipoidentificacion_id, 
      cat_estadocivil, 
      cat_ciudad, 
      cat_sexo,
      cat_pais,
      cat_provincia)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id_persona`,
      [nombre, apellido, fecha_nacimiento, direccion, telefono, cedula, correopersonal, correoinstitucional, observacion, estado, cat_tipoidentificacion_id, cat_estadocivil, cat_ciudad, cat_sexo, cat_pais, cat_provincia]);

    const personaId = personaInsertResult.rows[0].id_persona;

    // Insertar en la tabla 'cliente' usando el id_persona generado
    const clienteInsertResult = await user.query(`
     INSERT INTO administracion.cliente
      (fecha_registro, 
      fecha_actualizacion, 
      estado, 
      persona_id) 
      VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $1, $2) RETURNING *`,
      [estado, personaId]);

    // Confirmar la transacción
    await user.query('COMMIT');

    // Retornar el cliente creado y el token
    return { cliente: clienteInsertResult.rows[0] };
  } catch (error) {
    await user.query('ROLLBACK');
    throw error;
  } finally {
    user.release();
  }
}

async function getAllClientes() {
  const clientes = await pool.connect();
  try {
    const resultado = await clientes.query(`
            SELECT
          c.id_cliente,
          c.fecha_registro,
          c.fecha_actualizacion,
          c.estado AS estado_cliente,
          p.id_persona,
          p.nombre,
          p.apellido,
          p.fecha_nacimiento,
          p.direccion,
          p.telefono,
          p.cedula,
          p.correopersonal,
          p.correoinstitucional,
          p.observacion,
          p.estado AS estado_persona,
          tip_ident.descripcion AS tipo_identificacion,
          est_civil.descripcion AS estado_civil,
          ciudad.descripcion AS ciudad,
          sexo.descripcion AS sexo,
          pais.descripcion AS pais,
          provincia.descripcion AS provincia
      FROM
          administracion.cliente c
      JOIN
          administracion.persona p ON c.persona_id = p.id_persona
      LEFT JOIN
          administracion.detallecatalogo tip_ident ON p.cat_tipoidentificacion_id = tip_ident.id
      LEFT JOIN
          administracion.detallecatalogo est_civil ON p.cat_estadocivil = est_civil.id
      LEFT JOIN
          administracion.detallecatalogo ciudad ON p.cat_ciudad = ciudad.id
      LEFT JOIN
          administracion.detallecatalogo sexo ON p.cat_sexo = sexo.id
      LEFT JOIN
          administracion.detallecatalogo provincia ON p.cat_provincia = provincia.id
      LEFT JOIN
          administracion.detallecatalogo pais ON p.cat_pais = pais.id
    `);
    return resultado.rows;
  } finally {
    clientes.release()
  }
   
}

export const getClienteId = async (clienteId) => {
  try {
    const connection = await pool.connect();

    const query = `
      SELECT
        c.id_cliente,
        c.fecha_registro,
        c.fecha_actualizacion,
        c.estado AS estado_cliente,
        p.id_persona,
        p.nombre,
        p.apellido,
        p.fecha_nacimiento,
        p.direccion,
        p.telefono,
        p.cedula,
        p.correopersonal,
        p.correoinstitucional,
        p.observacion,
        p.estado AS estado_persona,
        tip_ident.descripcion AS tipo_identificacion,
        est_civil.descripcion AS estado_civil,
        ciudad.descripcion AS ciudad,
        sexo.descripcion AS sexo,
        pais.descripcion AS pais,
        provincia.descripcion AS provincia
      FROM
        administracion.cliente c
      JOIN
        administracion.persona p ON c.persona_id = p.id_persona
      LEFT JOIN
        administracion.detallecatalogo tip_ident ON p.cat_tipoidentificacion_id = tip_ident.id
      LEFT JOIN
        administracion.detallecatalogo est_civil ON p.cat_estadocivil = est_civil.id
      LEFT JOIN
        administracion.detallecatalogo ciudad ON p.cat_ciudad = ciudad.id
      LEFT JOIN
        administracion.detallecatalogo sexo ON p.cat_sexo = sexo.id
      LEFT JOIN
        administracion.detallecatalogo provincia ON p.cat_provincia = provincia.id
      LEFT JOIN
        administracion.detallecatalogo pais ON p.cat_pais = pais.id
      WHERE 
        c.id_cliente = $1;
    `;

    const result = await connection.query(query, [clienteId]);
    connection.release();

    // Si no se encontró el cliente, retorna null
    if (result.rows.length === 0) {
      return null;
    }

    // Retorna el cliente encontrado
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el cliente por ID:', error);
    throw error;  // Lanza el error para que lo maneje el controlador
  }
};


// Modelo de actualización del cliente
export const updateCliente = async (clienteId, updatedData) => {
  const { estado, persona } = updatedData;
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');

    // Verificar si el cliente existe y obtener persona_id
    const clienteExistenteQuery = `
      SELECT persona_id 
      FROM administracion.cliente 
      WHERE id_cliente = $1
    `;
    const clienteExistenteResult = await cliente.query(clienteExistenteQuery, [clienteId]);
    
    if (clienteExistenteResult.rows.length === 0) {
      throw new Error('El cliente no existe.');
    }

    const personaId = clienteExistenteResult.rows[0].persona_id;

    // Verificar si la cédula ya está registrada
    const existingCedulaQuery = `
      SELECT id_persona 
      FROM administracion.persona 
      WHERE cedula = $1 AND id_persona <> $2
    `;
    const existingCedulaResult = await cliente.query(existingCedulaQuery, [persona.cedula, personaId]);
    if (existingCedulaResult.rows.length > 0) {
      throw new Error('Cédula ya registrada, la cédula ya pertenece a un cliente registrado.');
    }

    // Actualizar la tabla cliente
    const clienteQuery = `
      UPDATE administracion.cliente 
      SET fecha_actualizacion = NOW(), estado = $2 
      WHERE id_cliente = $1;
    `;
    await cliente.query(clienteQuery, [clienteId, estado]);

    // Actualizar la tabla persona
    const personaQuery = `
       UPDATE administracion.persona
          SET 
            nombre = $2,
            apellido = $3,
            fecha_nacimiento = $4,
            direccion = $5,
            telefono = $6,
            cedula = $7,
            correopersonal = $8,
            correoinstitucional = $9,
            observacion = $10,
            cat_tipoidentificacion_id = $11,
            cat_estadocivil = $12,
            cat_ciudad = $13,
            cat_sexo = $14,
            cat_pais = $15,
            cat_provincia = $16
          WHERE 
            id_persona = $1;
 
    `;
    await cliente.query(personaQuery, [
      personaId, 
      persona.nombre,
      persona.apellido,
      persona.fecha_nacimiento,
      persona.direccion,
      persona.telefono,
      persona.cedula,
      persona.correopersonal,
      persona.correoinstitucional,
      persona.observacion,
      persona.cat_tipoidentificacion_id,
      persona.cat_estadocivil,
      persona.cat_ciudad,
      persona.cat_sexo,
      persona.cat_pais,
      persona.cat_provincia
    ]);

    await cliente.query('COMMIT');
    return { success: true };
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
};



export const deleteCliente = async (userDeleteId, newData) => {
  

};

// Exportar las funciones del modelo
export default {
      addCliente,
      getAllClientes,
      getClienteId,
      updateCliente,
      deleteCliente,
};