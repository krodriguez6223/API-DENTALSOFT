import Cliente from '../models/Cliente.Model.js';

import { getClienteId } from '../models/Cliente.Model.js';
import { updateCliente } from '../models/Cliente.Model.js';
import { deleteCliente } from '../models/Cliente.Model.js';

//crear cliente
export const createCliente = async (req, res) => {
    const { nombre, 
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
           cat_provincia
         } = req.body;
  
    if (!nombre || !apellido || !cedula) {
      const camposFaltantes = [];
      if (!nombre) camposFaltantes.push('Nombre');
      if (!apellido) camposFaltantes.push('Apellido');
      if (!cedula) camposFaltantes.push('Cédula');
      return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
    }
  
    try {
      const clienteData = await Cliente.addCliente(
        { nombre, apellido, fecha_nacimiento, direccion, telefono, cedula, correopersonal, correoinstitucional, observacion, cat_tipoidentificacion_id, cat_estadocivil, cat_ciudad, cat_sexo, cat_pais, cat_provincia },
        { estado }
      );
  
      if (clienteData.error) {
        return res.status(400).json({ error: clienteData.error });
      }
        res.status(201).json({message: 'Cliente creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
//obtener todos los clientes
export const getClintes = async (req, res) => {
  try{
    const clientes = await Cliente.getAllClientes();

    res.status(200).json(clientes)
 } catch(error){
   res.status(500).json({ error: 'Error interno del servidor' });
 }
}
//obtener un cliente por id
export const getClienteById = async (req, res) => {
  try {
    const cliente = await getClienteId(req.params.clienteId); 
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener el cliente por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
    
}

//actualizar clientes por id
export const updateClienteById = async (req, res) => {
  const clienteId = req.params.clienteId;
  const { nombre, 
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
    cat_provincia
  } = req.body;

  try {

    const persona = {nombre, apellido, fecha_nacimiento, direccion, telefono, cedula, correopersonal, correoinstitucional, observacion, cat_tipoidentificacion_id, cat_estadocivil, cat_ciudad, cat_sexo, cat_pais, cat_provincia  };
    const updated = await Cliente.updateCliente(clienteId, { persona, estado });

    res.status(200).json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    const statusCode = ['El cliente ya existe.', 'Cédula ya registrada'].includes(error.message) ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
  
};


export const deleteClienteById = async (req, res) => {
  
}


