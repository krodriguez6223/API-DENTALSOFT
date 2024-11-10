import User from '../../models/Administration/User.Model.js';

import { getUserId } from '../../models/Administration/User.Model.js';
import { updateUser } from '../../models/Administration/User.Model.js';
import { deleteUser } from '../../models/Administration/User.Model.js';
import { updateCajaById } from '../../models/Administration/User.Model.js';


export const createUser = async (req, res) => {
  const { nombre_usuario, contrasenia, estado, id_rol, nombre, apellido, fecha_nacimiento, direccion, telefono, cedula } = req.body;
 // Verificar si algún campo requerido está vacío
if (!nombre_usuario || !contrasenia || !cedula || !nombre || !apellido ) {
  const camposFaltantes = [];
  if (!nombre_usuario) camposFaltantes.push('Nombre de usuario');
  if (!contrasenia) camposFaltantes.push('Contraseña');
  if (!cedula) camposFaltantes.push('Cédula');
  if (!nombre) camposFaltantes.push('Nombres');
  if (!apellido) camposFaltantes.push('Apellidos');
  
  
  return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
}

  try {
    const userSave = await User.addUser({ nombre_usuario, contrasenia, estado },{ nombre, apellido, fecha_nacimiento, direccion, telefono, cedula }, id_rol);
    if (userSave.error) {
      return res.status(400).json({ error: userSave.error }); 
    }
    res.status(201).json({message: 'Usuario agregado exitosamente', userSave});
  } catch (error) {
    if (error.message === 'El nombre de usuario ya está en uso.' || error.message === 'El rol seleccionado no está registrado. ') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getUsers = async (req, res) => {
    try{
       const users = await User.getAllUsers();

       res.status(200).json(users)
    } catch(error){
      res.status(500).json({ error: 'Error interno del servidors' });
    }
}

//funcion para obtener un usuario en especifico
export const getUserById = async (req, res) => {
  try {
    const user = await getUserId(req.params.userId); // No pasar 'res'
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el cliente por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

//funcion para actulizar el usuario

export const updateUserById = async (req, res) => {
  const userId = req.params.userId;
  const { nombre_usuario, contrasenia, estado, id_rol, nombre, apellido, fecha_nacimiento, direccion, telefono, cedula, caja_id } = req.body;

  try {
    const persona = { nombre, apellido, fecha_nacimiento, direccion, telefono, cedula };
    const updated = await updateUser(userId, { nombre_usuario, contrasenia, estado, id_rol, persona, caja_id });

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    const statusCode = ['El nombre de usuario ya está en uso.', 'Cédula ya registrada'].includes(error.message) ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};


//funcion para crear caja
export const createCaja = async (req, res) => {
  const { nombre, estado } = req.body;

  if (!nombre ) {
    const camposFaltantes = [];
    if (!nombre) camposFaltantes.push('Nombre de caja');
  

    return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
  }

  try {
    // Llama a la función addCaja con los parámetros proporcionados
    const resultSave = await User.addCaja({ nombre, estado });

    // Verificar si la caja ya existe
    if (resultSave && resultSave.exists) {
      return res.status(400).json({ error: 'Esta caja ya se encuentra registrada.' });
    }

    res.status(201).json(resultSave);
  } catch (error) {
    console.error('Error al crear caja:', error);

    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


//funcion para obtener todos los usuarios
export const getCajas = async (req, res) => {
  try {
    const cajas = await User.getAllCajas();
    res.status(200).json(cajas);
  } catch (error) {
    console.error('Error al obtener las cajas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//funcion para obtener todos los usuarios
export const getCajasActivas = async (req, res) => {
  try {
    const cajas = await User.getAllCajasActivas();
    res.status(200).json(cajas);
  } catch (error) {
    console.error('Error al obtener las cajas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//funcion para actulizar el usuario

export const updateCaja = async (req, res) => {
  try {
    const cajaId = req.params.cajaId;
    const newData = req.body;
    
    if (!newData || Object.keys(newData).length === 0) {
      return res.status(400).json({ error: 'Se requieren datos actualizados para editar la caja' });
    }

    const existingCaja = await updateCajaById(cajaId, newData); // Pasa newData a la función updateCajaById
    if (existingCaja.error) {
      return res.status(404).json({ error: existingCaja.error });
    }
  
    res.status(200).json({ message: 'Caja actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la caja por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const deleteUserById = async (req, res) => {
  try {
   const userDeleteId = req.params.userDeleteId;
   const newData = req.body;
  // console.log('desde el controlador',newData)
  // console.log('desde el controlador',userDeleteId)      
   if (!newData || Object.keys(newData).length === 0) {
     return res.status(400).json({ error: 'Se requieren datos actualizados para editar el usuario' });
   }     
   const result = await deleteUser(userDeleteId, newData);
   if (result.error) {
     return res.status(404).json({ error: result.error });
   }          
  if(newData.estado == true){
    res.status(200).json({ message: 'Usuario activado correctamente' });
  }else{
   res.status(200).json({ message: 'Usuario desactivado correctamente' });
  }     
 } catch (error) {
 // console.error('Error al inactivar el usuario por ID:', error);
   res.status(500).json({ error: 'Error interno del servidor..' });
 }
}


