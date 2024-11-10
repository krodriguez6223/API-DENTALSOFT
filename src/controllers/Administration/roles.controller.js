
import Rol from '../../models/Administration/Role.Model.js';


export const createRoles = async (req, res) => {
    const { nombre, estado, } = req.body;

    if (!nombre) {
        const camposFaltantes = [];
        if (!descripcion) camposFaltantes.push('Nombre');
        return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
    }

    try {
        const data = await Rol.addRoles({ nombre, estado });
        if (data.error) {
            return res.status(400).json({ error: data.error });
        }
        res.status(201).json({
            message: 'catalogo creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear el catalogo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const getRoles = async (req, res) => {
  try {
    const cajas = await Rol.getAllRolesModel();
    res.status(200).json(cajas);
  } catch (error) {
    console.error('Error al obtener las cajas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateRolesById = async (req, res) => {
  const rolId = req.params.rolId;
  const { nombre, estado  } = req.body;

  try {

    const updated = await Rol.updatRoles(rolId, { nombre, estado });

    res.status(200).json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    const statusCode = ['Nombre de rol ya existe, por favor ingrese un nombre de rol diferente'].includes(error.message) ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

export const getRolesById = async (req, res) => {
   /* try {
        const catalogo = await getCatalogoId(req.params.catalogoId); 
        
        if (!catalogo) {
          return res.status(404).json({ error: 'Catalogo no encontrado' });
        }
    
        res.status(200).json(catalogo);
      } catch (error) {
        console.error('Error al obtener el catalogo por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }*/
}









