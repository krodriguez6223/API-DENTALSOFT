
import Submodulo from '../../models/Administration/submodulos.Model.js';


export const createSubmodulos = async (req, res) => {
    const { nombre, descripcion, ruta, estado, modulo_id  } = req.body;

    if (!nombre) {
        const camposFaltantes = [];
        if (!descripcion) camposFaltantes.push('Nombre');
        return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
    }

    try {
        const data = await Submodulo.addSubmodulo({  nombre, descripcion, ruta, estado, modulo_id });
        if (data.error) {
            return res.status(400).json({ error: data.error });
        }
        res.status(201).json({
            message: 'Submodulo creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear el submodulo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const getSubmodulos = async (req, res) => {
  try {
    const submodulo = await Submodulo.getAllSubmodulosModel();
    res.status(200).json(submodulo);
  } catch (error) {
    console.error('Error al obtener los submodulos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateSubmodulosById = async (req, res) => {
  const submoduloId = req.params.submoduloId;
  const {  nombre, descripcion, ruta, estado, modulo_id  } = req.body;

  try {

    const updated = await Submodulo.updatSubmodulo(submoduloId, { nombre, descripcion, ruta, estado, modulo_id });

    res.status(200).json({ message: 'Submodulo actualizado correctamente' });
  } catch (error) {
    const statusCode = ['Nombre de submodulo ya existe, por favor ingrese un nombre de submodulo diferente'].includes(error.message) ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

export const getSubmodulosById = async (req, res) => {
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









