import { Router } from "express";
import routesConfig from '../../conf/routes.js';
import * as catalogoCtrl from '../../controllers/Administration/catalogo.controller.js';
import { verifyToken } from "../../middlewares/auth.jwt.js";
import { checkPermissions } from "../../middlewares/permissions.js";

const router = Router();

const createRoutes = (moduleConfig) => {
    const { path, name, id } = moduleConfig;

    // Rutas para el submodulo (catalogo)   
    router.post(path, [verifyToken, checkPermissions(name, id)], catalogoCtrl.createCatalogo);
    router.get(path, [verifyToken, checkPermissions(name, id)], catalogoCtrl.getCatalogo);
    router.get(`${path}/:catalogoId`, [verifyToken, checkPermissions(name, id)], catalogoCtrl.getCatalogoById);
    router.put(`${path}/:catalogoId`, [verifyToken, checkPermissions(name, id)], catalogoCtrl.updateCatalogoById);
    
    // Rutas para el submodulo(detallecatalogo)
    router.post(path, [verifyToken, checkPermissions(name, id)], catalogoCtrl.createDetCatalogo);
    router.get(path, [verifyToken, checkPermissions(name, id)], catalogoCtrl.getDetCatalogo);
    router.get(`${path}/:detallecatalogoId`, [verifyToken, checkPermissions(name, id)], catalogoCtrl.getDetCatalogoById);
    router.put(`${path}/:detallecatalogoId`, [verifyToken, checkPermissions(name, id)], catalogoCtrl.updateDetCatalogoById);
    
};

Object.values(routesConfig).forEach(moduleConfig => {
    createRoutes(moduleConfig);
});

export default router;


