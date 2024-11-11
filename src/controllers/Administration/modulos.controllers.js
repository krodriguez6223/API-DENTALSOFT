
import Modulo from '../../models/Administration/Modulos.Model.js';


export const createModulos = async (req, res) => {
    const { nombre, descripcion, ruta, estado  } = req.body;

    if (!nombre) {
        const camposFaltantes = [];
        if (!descripcion) camposFaltantes.push('Nombre');
        return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
    }

    try {
        const data = await Modulo.addModulos({  nombre, descripcion, ruta, estado });
        if (data.error) {
            return res.status(400).json({ error: data.error });
        }
        res.status(201).json({
            message: 'Modulo creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear el modulo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const getModulos = async (req, res) => {
  try {
    const modulos = await Modulo.getAllModulosModel();
    res.status(200).json(modulos);
  } catch (error) {
    console.error('Error al obtener los modulos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateModulosById = async (req, res) => {
  const moduloId = req.params.moduloId;
  const {  nombre, descripcion, ruta, estado  } = req.body;

  try {

    const updated = await Modulo.updatModulo(moduloId, { nombre, descripcion, ruta, estado });

    res.status(200).json({ message: 'Modulo actualizado correctamente' });
  } catch (error) {
    const statusCode = ['Nombre de modulo ya existe, por favor ingrese un nombre de modulo diferente'].includes(error.message) ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

export const getModulosById = async (req, res) => {
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









