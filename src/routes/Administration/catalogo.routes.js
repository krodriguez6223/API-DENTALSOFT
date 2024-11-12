import { Router } from "express";
import routesConfig from '../../conf/routes.js';  // Importa la configuración de rutas
import * as catalogoCtrl from '../../controllers/Administration/catalogo.controller.js';
import { verifyToken } from "../../middlewares/auth.jwt.js";
import { checkPermissions } from "../../middlewares/permissions.js";

const router = Router();

// Función para crear rutas dinámicamente
const createRoutes = (moduleConfig) => {
    // Ruta principal del módulo
    router.post(moduleConfig.path, [verifyToken, checkPermissions(moduleConfig.path)], catalogoCtrl.createCatalogo);
    router.get(moduleConfig.path, [verifyToken, checkPermissions(moduleConfig.path)], catalogoCtrl.getCatalogo);
    router.get(`${moduleConfig.path}/:catalogoId`, [verifyToken, checkPermissions(moduleConfig.path)], catalogoCtrl.getCatalogoById);
    router.put(`${moduleConfig.path}/:catalogoId`, [verifyToken, checkPermissions(moduleConfig.path)], catalogoCtrl.updateCatalogoById);

    // Crear rutas para submódulos si existen
    if (moduleConfig.submodules) {
        Object.keys(moduleConfig.submodules).forEach(submoduleKey => {
            const submodulePath = moduleConfig.submodules[submoduleKey];
            router.post(submodulePath, [verifyToken, checkPermissions(moduleConfig.path, submodulePath)], catalogoCtrl.createDetCatalogo);
            router.get(submodulePath, [verifyToken, checkPermissions(moduleConfig.path, submodulePath)], catalogoCtrl.getDetCatalogo);
            router.get(`${submodulePath}/:detallecatalogoId`, [verifyToken, checkPermissions(moduleConfig.path, submodulePath)], catalogoCtrl.getDetCatalogoById);
            router.put(`${submodulePath}/:detallecatalogoId`, [verifyToken, checkPermissions(moduleConfig.path, submodulePath)], catalogoCtrl.updateDetCatalogoById);
        });
    }
};

// Crear rutas para todos los módulos definidos en la configuración
Object.values(routesConfig).forEach(moduleConfig => {
    createRoutes(moduleConfig);
});

export default router;
