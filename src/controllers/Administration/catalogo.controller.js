import Catalogo from '../../models/Administration/Catalogo.Model.js';

import { getCatalogoId } from '../../models/Administration/Catalogo.Model.js';
import { updateCatalogo } from '../../models/Administration/Catalogo.Model.js';

import { getDetCatalogoId } from '../../models/Administration/Catalogo.Model.js';
import { updateDetCatalogo } from '../../models/Administration/Catalogo.Model.js';

///CRUD para catalogo
export const createCatalogo = async (req, res) => {
    const { descripcion, estado, } = req.body;

    if (!descripcion) {
        const camposFaltantes = [];
        if (!descripcion) camposFaltantes.push('Descripcion');
        return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
    }

    try {
        const catalogoData = await Catalogo.addCatalogo({ descripcion, estado });
        if (catalogoData.error) {
            return res.status(400).json({ error: catalogoData.error });
        }
        res.status(201).json({
            message: 'catalogo creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear el catalogo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getCatalogo = async (req, res) => {
    try{
        const catalogo = await Catalogo.getAllCatalogo();
    
        res.status(200).json(catalogo)
     } catch(error){
       res.status(500).json({ error: 'Error interno del servidor' });
     }
}

export const getCatalogoById = async (req, res) => {
    try {
        const catalogo = await getCatalogoId(req.params.catalogoId); 
        
        if (!catalogo) {
          return res.status(404).json({ error: 'Catalogo no encontrado' });
        }
    
        res.status(200).json(catalogo);
      } catch (error) {
        console.error('Error al obtener el catalogo por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
}


export const updateCatalogoById = async (req, res) => {
    const catalogoId = req.params.catalogoId;
    const { descripcion, estado  } = req.body;

    try {

      const updated = await Catalogo.updateCatalogo(catalogoId, { descripcion, estado });
  
      res.status(200).json({ message: 'Catalogo actualizado correctamente' });
    } catch (error) {
      const statusCode = ['Nombre de catálogo ya existe, por favor ingrese un nombre de catálogo diferente'].includes(error.message) ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
};

///CRUD para detalle catalogo
export const createDetCatalogo = async (req, res) => {
    const {catalogo_id, descripcion, valor, estado } = req.body;

    if (!descripcion) {
        const camposFaltantes = [];
        if (!descripcion) camposFaltantes.push('Descripcion');
        return res.status(400).json({ error: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}.` });
    }

    try {
        const catalogoData = await Catalogo.addDetCatalogo({catalogo_id, descripcion, valor, estado });
        if (catalogoData.error) {
            return res.status(400).json({ error: catalogoData.error });
        }
        res.status(201).json({
            message: 'detalle catalogo creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear el catalogo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getDetCatalogo = async (req, res) => {
    try{
        const catalogoDet = await Catalogo.getAllDetCatalogo();
    
        res.status(200).json(catalogoDet)
     } catch(error){
       res.status(500).json({ error: 'Error interno del servidor' });
     }
}

export const getDetCatalogoById = async (req, res) => {
    try {
        const detcatalogo = await getDetCatalogoId(req.params.detallecatalogoId); 
        
        if (!detcatalogo) {
          return res.status(404).json({ error: 'Catalogo no encontrado' });
        }
    
        res.status(200).json(detcatalogo);
      } catch (error) {
        console.error('Error al obtener el catalogo por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }

}


export const updateDetCatalogoById = async (req, res) => {
    const catalogoId = req.params.detallecatalogoId;
    const {catalogo_id, descripcion, valor, estado } = req.body;

    try {

      const updated = await Catalogo.updateDetCatalogo(catalogoId, { catalogo_id, descripcion, valor, estado });
  
      res.status(200).json({ message: 'Catalogo actualizado correctamente' });
    } catch (error) {
      const statusCode = ['Nombre de catálogo ya existe, por favor ingrese un nombre de catálogo diferente'].includes(error.message) ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
};






