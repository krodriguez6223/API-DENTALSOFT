
import Permisos from '../../models/Administration/Permisos.Model.js';


export const createPermisos = async (req, res) => {
    const { id_rol, entidad, id_modulo, created, read, updatePerm, deletePerm, exportPerm, printPerm  } = req.body;

    if (!entidad) {
        const camposFaltantes = [];
        if (!descripcion) camposFaltantes.push('Nombre');
        return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
    }

    try {
        const data = await Permisos.addPermisos({ id_rol, entidad, id_modulo, created, read, updatePerm, deletePerm, exportPerm, printPerm });
        if (data.error) {
            return res.status(400).json({ error: data.error });
        }
        res.status(201).json({
            message: 'Permiso creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear el permiso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const getPermisos = async (req, res) => {
  try {
    const permiso = await Permisos.getAllPermisosModel();
    res.status(200).json(permiso);
  } catch (error) {
    console.error('Error al obtener las permisos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updatePermisosById = async (req, res) => {
  const permisoId = req.params.permisoId;
  const { id_rol, entidad, id_modulo, created, read, updatePerm, deletePerm, exportPerm, printPerm  } = req.body;

  try {

    const updated = await Permisos.updatPermiso(permisoId, { id_rol, entidad, id_modulo, created, read, updatePerm, deletePerm, exportPerm, printPerm });

    res.status(200).json({ message: 'Permiso actualizado correctamente' });
  } catch (error) {
    const statusCode = ['Nombre de permiso ya existe, por favor ingrese un nombre de permiso diferente'].includes(error.message) ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

export const getPermisosById = async (req, res) => {
    try {
        const permiso = await Permisos.getPermisoId(req.params.permisoId); 
        
        if (!permiso) {
          return res.status(404).json({ error: 'Este rol no tiene permisos asignados' });
        }
    
        res.status(200).json(permiso);
      } catch (error) {
        console.error('Error al obtener el permiso por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
}









